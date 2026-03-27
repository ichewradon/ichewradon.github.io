const username = "ichewradon";

const languageColors = {
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Swift: "#ffac45",
  C: "#555555",
  "C++": "#f34b7d"
};

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 }
  ];

  for (let i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count > 0) {
      return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

async function loadRepos() {
  const res = await fetch(`https://api.github.com/users/${username}/repos`);
  let repos = await res.json();

  // ❌ remove forks
  repos = repos.filter(repo => !repo.fork);

  // 🔥 sort by recent activity
  repos.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

  // ⭐ take top 6
  const topRepos = repos.slice(0, 6);

  const container = document.getElementById("repo-container");
  container.innerHTML = "";

  topRepos.forEach(repo => {
    const card = document.createElement("div");
    card.className = "repo-card";

    const langColor = languageColors[repo.language] || "#888";

    card.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <p>${repo.description || "No description"}</p>

      <div class="repo-meta">
        ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}
      </div>

      ${
        repo.language
          ? `<span class="language" style="background:${langColor}">
              ${repo.language}
            </span>`
          : ""
      }

      <div class="repo-meta">
        Updated ${timeAgo(repo.pushed_at)}
      </div>
    `;

    container.appendChild(card);
  });
}

loadRepos();
