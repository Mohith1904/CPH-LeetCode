 async function getQuestionData(titleSlug, dataType, vscode) {
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
      vscode.window.showErrorMessage("Error fetching question content:", data.errors ? data.errors[0].message:"Check Internet Connection");
      return null;
    }

    const result = data.data.question[dataType];


    console.log(`${dataType}:`, result);

    return result;
  } catch (error) {
    vscode.window.showErrorMessage("Error fetching question content:", "Provide valid URL");
    return null;
  }
};

module.exports = { getQuestionData };