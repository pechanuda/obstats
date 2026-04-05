"use client";

export function PrintButton({ href }: { href: string }) {
  const handleClick = () => {
    const existing = document.getElementById("print-frame");
    if (existing) {
      existing.remove();
    }

    const iframe = document.createElement("iframe");
    iframe.id = "print-frame";
    iframe.src = href;
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";

    document.body.appendChild(iframe);
  };

  return (
    <button className="button secondary" type="button" onClick={handleClick}>
      Tisk / Uložit jako PDF
    </button>
  );
}
