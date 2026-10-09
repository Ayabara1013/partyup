'use client'
import {useRef} from "react";

export default function Home() {
  const displayRef = useRef(null);

  async function onClick() {
    const response = await fetch('https://docs.google.com/document/d/e/2PACX-1vSvM5gDlNvt7npYHhp_XfsJvuntUhq184By5xO_pA4b_gCWeXb6dM6ZxwN8rE6S4ghUsCj2VKR21oEP/pub');
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const data = Array.from(doc.querySelector("table>tbody").rows)
      .slice(1) // Skip the header
      .map(row => {
        const [x, character, y] = Array.from(
          row.cells,
          cell => cell.textContent.trim()
        );
        return [Number(x), character, Number(y)];
      });
    const gridX = Math.max(...data.map(([x, ,]) => x));
    const gridY = Math.max(...data.map(([, , y]) => y));

    const grid = Array.from(
      {length: gridY + 1},
      () => Array(gridX + 1).fill(" ")
    );
    for (const [x, character, y] of data) {
      grid[gridY - y][x] = character;
    }
    displayRef.current.innerText= grid.map(row => row.join("")).join("\n");
    console.log(grid.map(row => row.join("")).join("\n"));
  }

  return (
    <div
      className='home-page flex flex-col sm:py-4 md:py-8 lg:pt-8 lg:pb-20 gap-8 lg:gap-28 w-full min-h-full border-2 border-dotted border-red-400'>
      <button className={`btn`} onClick={onClick}>Test</button>
      <span ref={displayRef}>123</span>
    </div>
  )
}