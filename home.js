let PROJECT_ID = 'm266lax5';
let DATASET = 'production';
let QUERY = encodeURIComponent(
  '*[_type in ["home", "event", "contactBlock", "member"]]'
);

let URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;

const gigsHeadlineContainer = document.querySelector(
  '#gigs-headline-container'
);
const gigsContainer = document.querySelector('#js-gig-container');
gigsContainer.innerHTML = '<div>Loading Gigs...</div>';
const firstSectionHeadlineContainer = document.querySelector(
  '#first-section-headline-container'
);
const firstSectionTextContainer = document.querySelector(
  '#first-section-text-container'
);
const membersSectionHeadlineContainer = document.querySelector(
  '#members-section-headline-container'
);
const contactBlockHeadlineContainer = document.querySelector(
  '#contact-block-headline-container'
);
const contactBlockTextContainer = document.querySelector(
  '#contact-block-text-container'
);
const bandMembersContainer = document.querySelector(
  '#js-band-members-container'
);

// fetch the content
fetch(URL)
  .then((res) => res.json())
  .then(({ result }) => {
    const page = result.find((obj) => obj?._id === 'home');
    const contactBlock = result.find((obj) => obj?._id === 'contactBlock');
    const gigs = result.filter((obj) => obj?._type === 'event');
    // sort all the members as well so that you don't have to sort every
    // category
    const members = result
      .filter((obj) => obj?._type === 'member')
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });

    // Put data in home page
    const {
      gigsHeadline,
      firstSectionHeadline,
      firstSectionText,
      membersSectionHeadline,
    } = page;
    gigsHeadlineContainer.innerText = gigsHeadline;
    firstSectionHeadlineContainer.innerText = firstSectionHeadline;
    sanityBlockContent(firstSectionTextContainer, firstSectionText);
    membersSectionHeadlineContainer.innerText = membersSectionHeadline;

    // Put Band Members in section
    handleBandMembers(members);

    // Put data in contact block
    const { contactHeadline, contactText } = contactBlock;
    contactBlockHeadlineContainer.innerText = contactHeadline;
    sanityBlockContent(contactBlockTextContainer, contactText);

    // Put gig data in sidebar
    const filteredGigs = gigs.filter((a) => new Date(a.date) >= new Date());
    if (filteredGigs.length > 0) {
      gigsContainer.innerHTML = filteredGigs
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(makeGig)
        .join('');
    } else if (filteredGigs.length === 0) {
      gigsContainer.innerHTML =
        '<div>We currently do not have any gigs. Please check back later!</div>';
    }
  })
  .catch((err) => console.error(err));

function makeGig({ headline, date, address1, address2, address3, eventUrl }) {
  return `
<a href="${eventUrl}" class="gig" title="Learn more about ${headline}">
  <h3>${headline}</h3>
  <div class="gig-time">
    <time datetime="${date}">${new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })} - ${new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  })}</time>
  </div>
  <div>${address1}</div>
  <div class="gig-address">
    <div>${address2}</div>
    <div>${address3}</div>
  </div>
</a>`;
}

function handleBandMembers(members) {
  const vocalMembers = members.filter((mem) => mem.group === 'vocals');
  const hornMembers = members.filter((mem) => mem.group === 'horns');
  const bandMembers = members.filter((mem) => mem.group === 'band');

  let renderedHtml = '';

  if (vocalMembers.length) {
    renderedHtml += '<tr><th>Vocals</th></tr>';
    renderedHtml += vocalMembers
      .map((mem) => `<tr><td>${mem.name}</td><td>${mem.instrument}</td></tr>`)
      .join('');
  }
  if (hornMembers.length) {
    renderedHtml += '<tr><th>Horns</th></tr>';
    renderedHtml += hornMembers
      .map((mem) => `<tr><td>${mem.name}</td><td>${mem.instrument}</td></tr>`)
      .join('');
  }
  if (bandMembers.length) {
    renderedHtml += '<tr><th>Band</th></tr>';
    renderedHtml += bandMembers
      .map((mem) => `<tr><td>${mem.name}</td><td>${mem.instrument}</td></tr>`)
      .join('');
  }

  if (renderedHtml) {
    bandMembersContainer.innerHTML = renderedHtml;
  }
}
