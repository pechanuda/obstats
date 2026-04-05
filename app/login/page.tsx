import { firstValue } from "../../lib/filters";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function errorMessage(error: string | undefined) {
  switch (error) {
    case "invalid":
      return "Neplatné heslo.";
    case "config":
      return "Aplikace není správně nakonfigurovaná.";
    default:
      return "";
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const error = firstValue(params.error);
  const next = firstValue(params.next) ?? "/";

  return (
    <main className="login-page">
      <section className="panel login-panel">
        <h1>KOBUL - výsledkový výcuc z ORISu</h1>
        <p>Zadej heslo pro vstup do aplikace.</p>
        <form action="/api/login" method="post" className="login-form">
          <input type="hidden" name="next" value={next} />
          <label className="field" htmlFor="password">
            <span>Heslo</span>
            <input id="password" name="password" type="password" required className="login-input" />
          </label>
          {error ? <p className="login-error">{errorMessage(error)}</p> : null}
          <button type="submit" className="button">
            Přihlásit se
          </button>
        </form>
      </section>
    </main>
  );
}
