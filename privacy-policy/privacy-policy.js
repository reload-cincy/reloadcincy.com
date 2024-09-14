let PROJECT_ID = 'm266lax5';
let DATASET = 'production';
let QUERY = encodeURIComponent('*[_type == "privacyPolicy"]');

let URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;

const headlineContainer = document.querySelector('#privacy-policy-header');
const privacyPolicyContainer = document.querySelector(
  '#privacy-policy-container'
);

// fetch the content
fetch(URL)
  .then((res) => res.json())
  .then(({ result }) => {
    const page = result[0];

    const headline = page.headline;
    console.log(headlineContainer, headline);
    headlineContainer.innerText = headline;

    sanityBlockContent(privacyPolicyContainer, page.privacyPolicy);
  })
  .catch((err) => console.error(err));
