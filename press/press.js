let PROJECT_ID = 'm266lax5';
let DATASET = 'production';
let QUERY = encodeURIComponent('*[_type == "contactBlock"]');

let URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;

const contactBlockHeadlineContainer = document.querySelector(
  '#contact-block-headline-container'
);
const contactBlockTextContainer = document.querySelector(
  '#contact-block-text-container'
);

// fetch the content
fetch(URL)
  .then((res) => res.json())
  .then(({ result }) => {
    const contactBlock = result.find((obj) => obj?._id === 'contactBlock');
    // Put data in contact block
    const { contactHeadline, contactText } = contactBlock;
    contactBlockHeadlineContainer.innerText = contactHeadline;
    sanityBlockContent(contactBlockTextContainer, contactText);
  })
  .catch((err) => console.error(err));
