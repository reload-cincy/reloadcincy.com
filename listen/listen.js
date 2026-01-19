let PROJECT_ID = 'm266lax5';
let DATASET = 'production';
let QUERY = encodeURIComponent(
  `*[_type in ["remoteVideo", "listenFile", "contactBlock"]] {
    _type == "listenFile" => {
      _type,
      title,
      "fileUrl": file.asset->url
    },
    _type == "remoteVideo" => {
      _type,
      title,
      url
    },
    _type == "contactBlock" => {
      _id,
      contactHeadline,
      contactText
    }
  }`
);

let URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;

const contactBlockHeadlineContainer = document.querySelector(
  '#contact-block-headline-container'
);
const contactBlockTextContainer = document.querySelector(
  '#contact-block-text-container'
);

const youtubeVideoSection = document.querySelector('#youtube-video-section');
const audioFileSection = document.querySelector('#audio-file-section');

// fetch the content
fetch(URL)
  .then((res) => res.json())
  .then(({ result }) => {
    const contactBlock = result.find((obj) => obj?._id === 'contactBlock');
    // Put data in contact block
    const { contactHeadline, contactText } = contactBlock ?? {};
    contactBlockHeadlineContainer.innerText = contactHeadline;
    sanityBlockContent(contactBlockTextContainer, contactText);

    // handle videos
    const youtubeVideos = result.filter((obj) => obj?._type === 'remoteVideo');
    youtubeVideoSection.innerHTML = '';
    youtubeVideos.forEach(function (video) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `<h3>${video.title}</h3>
          <iframe
            width="560"
            height="315"
            src="${video.url}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>`;
      youtubeVideoSection.appendChild(wrapper);
    });

    // handle files
    const audioFiles = result.filter((obj) => obj?._type === 'listenFile');
    audioFileSection.innerHTML = '';
    audioFiles.forEach(function (file) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('song');
      wrapper.innerHTML = `<div>${file.title}</div>
            <audio controls src="${file.fileUrl}" preload="none">
              Your browser does not support the
              <code>audio</code> element.
            </audio>`;
      audioFileSection.appendChild(wrapper);
    });
  })
  .catch((err) => console.error(err));
