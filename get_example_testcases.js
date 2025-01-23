 async function getQuestionData(titleSlug, dataType) {
  const url = "https://leetcode.com/graphql";
  const query = `
    query questionContent($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        ${dataType}
      }
    }
  `;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: { titleSlug },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error: ${data.errors ? data.errors[0].message : "Unknown error"}`
      );
    }

    const result = data.data.question[dataType];


    console.log(`${dataType}:`, result);

    return result;
  } catch (error) {
    console.error("Error fetching question content:", error.message);
  }
};

module.exports = { getQuestionData };