import React, { useEffect, useState } from 'react'

const Context = React.createContext();


function Provider({ children }) {



  const [zoomFragment, setZoomFragment] = useState([0, 100])

  const [audioDuration, setAudioDuration] = useState(0)

  const [playing, setPlaying] = useState(false);

  const [playbacktime, setPlaybacktime] = useState(0);

  const [activeSegmentLength, setActiveSegmentLength] = useState(10);
  //The length of the active segment in PERCENTAGE of the total audio length


  // const [mediaId, setMediaId] = useState('829086844a3211eea42102420a000003');
  // const [mediaId, setMediaId] = useState('9020231925e711eebf6302420a000003');
  const [mediaId, setMediaId] = useState();

  const [mp3, setMp3] = useState(null);

  const [name, setName] = useState('');
  const [lang, setLang] = useState('');

  const [translationData, setTranslationData] = useState([]);






  const fetchMp3 = (mediaId) => {
    setMp3(null)
    fetch(`https://flask.dev.transcribe.torsunov.ru/download_rus?file_name=${mediaId}/audio.mp3`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        setMp3(url);  // Store the object URL
      })
      .catch(error => {
        console.error("Error fetching MP3: ", error);
      });
  }

  useEffect(() => {
    const audio = new Audio(mp3);
    audio.onloadedmetadata = () => {
      setAudioDuration(audio.duration * 1000); // duration is in seconds, so multiply by 1000 to get milliseconds
    };
  }, [mp3]);


  const fetchTracks = (mediaId) => {
    setTranslationData([])
    fetch(`https://flask.dev.transcribe.torsunov.ru/get_all_data_for_editing?media=${mediaId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setTranslationData(data.flat());
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }


  useEffect(() => {
    if (mediaId) {
      setAudioDuration(0)
      setPlaybacktime(0)
      setPlaying(false)
      fetchMp3(mediaId)
      fetchTracks(mediaId)
    }
  }, [mediaId])




  return (<>
    <Context.Provider
      value={{
        state: {
          zoomFragment,
          audioDuration,
          playing,
          playbacktime,
          activeSegmentLength,
          mediaId,
          mp3,
          translationData,
          name,
          lang,
        },
        handles: {
          setZoomFragment,
          setAudioDuration,
          setPlaying,
          setPlaybacktime,
          setActiveSegmentLength,
          setMediaId,
          setMp3,
          setTranslationData,
          setName,
          setLang
        },
      }}
    >
      {children}
    </Context.Provider>
  </>
  )

}

const Consumer = Context.Consumer;

export { Context, Provider, Consumer };
