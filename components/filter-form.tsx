import { monthOptions } from "../lib/filters";

type FilterFormProps = {
  action: string;
  selectedYear: number;
  selectedMonth: number;
  years: number[];
  submitLabel: string;
};

export function FilterForm({
  action,
  selectedYear,
  selectedMonth,
  years,
  submitLabel,
}: FilterFormProps) {
  return (
    <form className="filters" action={action}>
      <div className="filters-grid filters-grid--compact">
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
      </div>

      <div className="actions">
        <button className="button" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
