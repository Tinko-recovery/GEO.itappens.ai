

async function test() {
  const payload = {
    page: 1,
    person_titles: ["Marketing"],
    q_keywords: "Hospital",
    person_locations: ["Bangalore"]
  };

  const res = await fetch("https://api.apollo.io/v1/mixed_people/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "X-Api-Key": "fake_key"
    },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Body:", text);
}

test();
