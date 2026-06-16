const API_URL = import.meta.env.VITE_API_URL;

/* ------------------ AUTH HEADERS ------------------ */
function getHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

/* ------------------ RESPONSE HANDLER ------------------ */
async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("❌ API ERROR:", data);
    throw new Error(data.error || "Request failed");
  }

  return data;
}

/* ------------------ ANALYZE GITHUB ------------------ */
export async function analyzeGithub(url) {
  const res = await fetch(`${API_URL}/api/analyze-project`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ githubUrl: url })
  });

  const data = await res.json();

if (!res.ok) {
  throw new Error(
    data.error || "Analysis failed"
  );
}

return data;
}

/* ------------------ ANALYZE UPLOAD ------------------ */
export async function analyzeUpload(files) {
  const formData = new FormData();

  files.forEach(file =>
    formData.append("files", file)
  );

  const res = await fetch(
    `${API_URL}/api/analyze-upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
    }
  );

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 400) {
      throw new Error(
        "GitHub repository could not be analyzed. Please try another repository."
      );
    }

    if (res.status === 503) {
      throw new Error(
        "AI service is temporarily busy. Please try again in a moment."
      );
    }

    throw new Error(
      data.error || "Analysis failed"
    );
  }

  return data;
}

/* ------------------ GET PROJECT LIST ------------------ */
export async function getProjects() {
  const res = await fetch(`${API_URL}/api/projects`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  return res.json();
}

/* ------------------ GET SINGLE PROJECT ------------------ */
export async function getProject(id) {
  const res = await fetch(`${API_URL}/api/project/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  return res.json();
}