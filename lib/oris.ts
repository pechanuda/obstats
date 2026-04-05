const ORIS_API_URL = "https://oris.ceskyorientak.cz/API/";
const OB_SPORT_ID = "1";
const ALL_RACES = "1";
const CLUB_LABEL_OVERRIDES: Record<string, string> = {
  "73": "KOBUL",
};

export type ClubOption = {
  id: string;
  abbr: string;
  name: string;
};

export type EventOption = {
  id: string;
  name: string;
  date: string;
  status: string;
  organizer: string;
};

export type SportOption = {
  id: string;
  label: string;
};

export type LevelOption = {
  id: string;
  label: string;
};

export type RaceReportRow = {
  runnerName: string;
  runnerClub: string;
  place: string;
  runnerTime: string | null;
  lossTime: string | null;
  lossPercent: number | null;
};

export type RaceReportGroup = {
  classId: string;
  className: string;
  winnerName: string;
  winnerClub: string;
  winnerTime: string | null;
  controls: string | null;
  distanceKm: string | null;
  climbing: string | null;
  rows: RaceReportRow[];
};

export type RaceReport = {
  event: {
    id: string;
    name: string;
    date: string;
    discipline: string;
    place: string;
    organizer: string;
  };
  groups: RaceReportGroup[];
};

type OrisResponse<T> = {
  Status: string;
  Data?: T;
};

type EventRecord = {
  ID: string;
  Name: string;
  Date: string;
  Status: string;
  Org1?: {
    Abbr?: string;
    Name?: string;
  };
  Discipline?: {
    ID?: string;
    NameCZ?: string;
    NameEN?: string;
  };
};

type ListRecord = {
  ID: string;
  Description_CZ?: string;
  Description_EN?: string;
  Name?: string;
};

type ClubRecord = {
  ID: string;
  Name: string;
  Abbr: string;
};

type ResultRecord = {
  ClassID: string;
  ClassDesc: string;
  Sort: string;
  Place: string;
  Name: string;
  RegNo?: string | null;
  ClubNameResults?: string | null;
  Time?: string | null;
  Loss?: string | null;
  ClubID: string;
};

type EventDetailRecord = {
  ID: string;
  Name: string;
  Date: string;
  Place: string;
  Org1?: {
    Abbr?: string;
    Name?: string;
  };
  Discipline?: {
    NameCZ?: string;
    NameEN?: string;
  };
  Classes?: Record<
    string,
    {
      ID: string;
      Name: string;
      Distance?: string;
      Climbing?: string;
      Controls?: string;
    }
  >;
};

function buildApiUrl(params: Record<string, string>) {
  const url = new URL(ORIS_API_URL);
  url.searchParams.set("format", "json");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url;
}

async function fetchOris<T>(params: Record<string, string>, nextRevalidate = 300) {
  const response = await fetch(buildApiUrl(params), {
    next: { revalidate: nextRevalidate },
  });

  if (!response.ok) {
    throw new Error(`ORIS request failed with ${response.status}`);
  }

  const payload = (await response.json()) as OrisResponse<T>;

  if (payload.Status !== "OK" || !payload.Data) {
    throw new Error("ORIS returned an invalid response");
  }

  return payload.Data;
}

async function hasUsableClubResults(eventId: string, clubId: string) {
  const data = await fetchOris<Record<string, ResultRecord>>(
    {
      method: "getEventResults",
      eventid: eventId,
      clubid: clubId,
    },
    300,
  );

  return Object.values(data).some((row) => {
    const hasTime = (row.Time ?? "").trim() !== "";
    const hasLoss = (row.Loss ?? "").trim() !== "";
    return hasTime || hasLoss;
  });
}

function monthDateRange(year: number, month: number) {
  if (month === 0) {
    return {
      start: `${year}-01-01`,
      end: `${year}-12-31`,
    };
  }

  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));

  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

function parseTimeToSeconds(time: string | null | undefined) {
  if (!time) {
    return null;
  }

  const parts = time.split(":").map(Number);

  if (parts.some((part) => Number.isNaN(part))) {
    return null;
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return null;
}

function normalizePlace(place: string | null | undefined) {
  if (!place) {
    return "";
  }

  return place.endsWith(".") ? place : `${place}.`;
}

function normalizeLossTime(loss: string | null | undefined) {
  if (!loss) {
    return null;
  }

  return loss.replace(/^\+\s*/, "");
}

function getClubDisplayName(clubId: string, fallback: string) {
  return CLUB_LABEL_OVERRIDES[clubId] ?? fallback;
}

function isNonTimeResult(time: string | null | undefined) {
  if (!time) {
    return true;
  }

  return !/^\d{1,2}:\d{2}(:\d{2})?$/.test(time.trim());
}

export async function getClubOptions() {
  const data = await fetchOris<Record<string, ClubRecord>>(
    { method: "getCSOSClubList" },
    86400,
  );

  return Object.values(data)
    .map((club) => ({
      id: club.ID,
      abbr: club.Abbr,
      name: club.Name,
    }))
    .sort((a, b) => a.abbr.localeCompare(b.abbr, "cs"));
}

export async function getSportOptions() {
  const data = await fetchOris<Record<string, ListRecord>>(
    { method: "getList", list: "sport" },
    86400,
  );

  return Object.values(data)
    .map((item) => ({
      id: item.ID,
      label: item.Description_CZ || item.Description_EN || item.ID,
    }))
    .sort((a, b) => a.id.localeCompare(b.id, "cs"));
}

export async function getLevelOptions() {
  const data = await fetchOris<Record<string, ListRecord>>(
    { method: "getList", list: "level" },
    86400,
  );

  return Object.values(data)
    .map((item) => ({
      id: item.ID,
      label: item.Description_CZ || item.Name || item.ID,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "cs"));
}

export async function getEventOptions(
  year: number,
  month: number,
  sport: string,
  level: string,
  clubId?: string,
) {
  const { start, end } = monthDateRange(year, month);
  const params: Record<string, string> = {
    method: "getEventList",
    datefrom: start,
    dateto: end,
    sport: sport || OB_SPORT_ID,
    all: ALL_RACES,
  };

  if (level && level !== "all") {
    params.level = level;
  }

  const data = await fetchOris<Record<string, EventRecord>>(params);

  const filteredEvents = Object.values(data)
    .filter((event) => event.Status === "R")
    .filter((event) => event.Discipline?.ID !== "10")
    .map((event) => ({
      id: event.ID,
      name: event.Name,
      date: event.Date,
      status: event.Status,
      organizer: event.Org1?.Abbr || event.Org1?.Name || "",
    }))
    .sort((a, b) => `${a.date}-${a.name}`.localeCompare(`${b.date}-${b.name}`, "cs"));

  if (!clubId) {
    return filteredEvents;
  }

  const clubMatches = await Promise.all(
    filteredEvents.map(async (event) => ({
      event,
      hasResults: await hasUsableClubResults(event.id, clubId),
    })),
  );

  return clubMatches.filter((item) => item.hasResults).map((item) => item.event);
}

export async function getRaceReport(eventId: string, clubId: string): Promise<RaceReport> {
  const [eventDetail, results] = await Promise.all([
    fetchOris<EventDetailRecord>({ method: "getEvent", id: eventId }),
    fetchOris<Record<string, ResultRecord>>({
      method: "getEventResults",
      eventid: eventId,
    }),
  ]);

  const allRows = Object.values(results);
  const classMeta = Object.values(eventDetail.Classes ?? {}).reduce<
    Record<
      string,
      {
        name: string;
        distanceKm: string | null;
        climbing: string | null;
        controls: string | null;
      }
    >
  >((accumulator, item) => {
    accumulator[item.ID] = {
      name: item.Name,
      distanceKm: item.Distance ?? null,
      climbing: item.Climbing ?? null,
      controls: item.Controls ?? null,
    };
    return accumulator;
  }, {});

  const groupedClubRows = allRows.reduce<Record<string, ResultRecord[]>>((accumulator, row) => {
    if (row.ClubID !== clubId) {
      return accumulator;
    }

    accumulator[row.ClassID] ??= [];
    accumulator[row.ClassID].push(row);
    return accumulator;
  }, {});

  const groups: RaceReportGroup[] = Object.entries(groupedClubRows)
    .map(([classId, rows]) => {
      const winner = allRows.find(
        (candidate) => candidate.ClassID === classId && candidate.Sort === "1",
      );

      if (!winner) {
        return null;
      }

      const normalizedRows = rows
        .map((row) => {
          const winnerSeconds = parseTimeToSeconds(winner.Time);
          const runnerSeconds = parseTimeToSeconds(row.Time);

          let lossPercent: number | null = null;

          if (winnerSeconds && runnerSeconds) {
            lossPercent = Number(
              (((runnerSeconds - winnerSeconds) / winnerSeconds) * 100).toFixed(2),
            );
          }

          return {
            runnerName: row.Name,
            runnerClub: getClubDisplayName(
              row.ClubID,
              row.ClubNameResults || row.RegNo?.slice(0, 3) || "",
            ),
            place: normalizePlace(row.Place),
            runnerTime: row.Time || null,
            lossTime:
              lossPercent === 0 ? "0:00" : normalizeLossTime(row.Loss) ?? null,
            lossPercent,
          };
        })
        .sort((a, b) => {
          const aNonTime = isNonTimeResult(a.runnerTime);
          const bNonTime = isNonTimeResult(b.runnerTime);

          if (aNonTime !== bNonTime) {
            return aNonTime ? 1 : -1;
          }

          return a.place.localeCompare(b.place, "cs", { numeric: true });
        });

      return {
        classId,
        className: classMeta[classId]?.name || winner.ClassDesc,
        winnerName: winner.Name,
        winnerClub: winner.ClubNameResults || winner.RegNo?.slice(0, 3) || "",
        winnerTime: winner.Time || null,
        controls: classMeta[classId]?.controls ?? null,
        distanceKm: classMeta[classId]?.distanceKm ?? null,
        climbing: classMeta[classId]?.climbing ?? null,
        rows: normalizedRows,
      };
    })
    .filter((group): group is RaceReportGroup => group !== null)
    .sort((a, b) => a.className.localeCompare(b.className, "cs"));

  return {
    event: {
      id: eventDetail.ID,
      name: eventDetail.Name,
      date: eventDetail.Date,
      discipline: eventDetail.Discipline?.NameCZ || eventDetail.Discipline?.NameEN || "",
      place: eventDetail.Place,
      organizer: eventDetail.Org1?.Abbr || eventDetail.Org1?.Name || "",
    },
    groups,
  };
}

export function getCurrentFilters() {
  const now = new Date();

  return {
    year: now.getUTCFullYear(),
    month: now.getUTCMonth() + 1,
  };
}
