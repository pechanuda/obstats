import { monthOptions } from "../lib/filters";
import type { ClubOption, LevelOption, SportOption } from "../lib/oris";

type FilterFormProps = {
  action: string;
  clubs: ClubOption[];
  sports: SportOption[];
  levels: LevelOption[];
  selectedClub: string;
  selectedYear: number;
  selectedMonth: number;
  selectedSport: string;
  selectedLevel: string;
  years: number[];
  submitLabel: string;
};

export function FilterForm({
  action,
  clubs,
  sports,
  levels,
  selectedClub,
  selectedYear,
  selectedMonth,
  selectedSport,
  selectedLevel,
  years,
  submitLabel,
}: FilterFormProps) {
  return (
    <form className="filters" action={action}>
      <div className="filters-grid filters-grid--compact">
        <div className="field">
          <label htmlFor="club">Klub</label>
          <select id="club" name="club" defaultValue={selectedClub}>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.abbr} - {club.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="year">Rok</label>
          <select id="year" name="year" defaultValue={String(selectedYear)}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="month">Měsíc</label>
          <select id="month" name="month" defaultValue={String(selectedMonth)}>
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="sport">Sport</label>
          <select id="sport" name="sport" defaultValue={selectedSport}>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="level">Typ závodu</label>
          <select id="level" name="level" defaultValue={selectedLevel}>
            <option value="all">Všechny závody</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="actions">
        <button className="button" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
