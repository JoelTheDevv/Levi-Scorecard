
const shoutoutQueue: string[] = [];
let isProcessing = false;

const clapAudio = new Audio('/sounds/clap.mp3');
clapAudio.preload = 'auto';
clapAudio.volume = 0.8;

const shoutoutMessages = [
  'Great job {name}, keep up the good work!',
  'Amazing work {name}, you are on fire!',
  'Well done {name}, keep those transfers coming!',
  'Fantastic job {name}, outstanding effort!',
  'Keep shining {name}, you are doing great!',
  'Superb work {name}, what a performance!',
  'That is how it is done {name}, excellent!',
  'Brilliant transfer {name}, keep it going!',
  'Big shoutout to {name}, absolutely amazing!',
  'Way to go {name}, keep smashing those goals!',
];

export function playTransferShoutout(agentName: string) {
  shoutoutQueue.push(agentName);
  processQueue();
}

function processQueue() {
  if (isProcessing || shoutoutQueue.length === 0) return;

  isProcessing = true;
  const agentName = shoutoutQueue.shift()!;

  let speechFinished = false;
  let clapFinished = false;
  let finished = false;

  const finishIfReady = () => {
    if (finished || !speechFinished || !clapFinished) return;

    finished = true;
    isProcessing = false;
    processQueue();
  };

  const fadeOut = (
    audio: HTMLAudioElement,
    duration: number,
    callback?: () => void
  ) => {
    const fadeSteps = 20;
    const stepTime = duration / fadeSteps;
    const volumeStep = audio.volume / fadeSteps;
    let currentStep = 0;

    const fadeInterval = window.setInterval(() => {
      currentStep++;
      audio.volume = Math.max(0, audio.volume - volumeStep);

      if (currentStep >= fadeSteps) {
        window.clearInterval(fadeInterval);
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0.8;
        callback?.();
      }
    }, stepTime);
  };

  const playClap = () => {
    clapAudio.currentTime = 1;
    clapAudio.volume = 0.8;

    clapAudio.onended = () => {
      clapFinished = true;
      finishIfReady();
    };

    clapAudio.onerror = () => {
      clapFinished = true;
      finishIfReady();
    };

    clapAudio.play().then(() => {
      clapAudio.ontimeupdate = () => {
        if (clapAudio.currentTime >= 5) {
          clapAudio.ontimeupdate = null;
          fadeOut(clapAudio, 1000, () => {
            clapFinished = true;
            finishIfReady();
          });
        }
      };
    }).catch((error) => {
      console.error('Clap audio failed:', error);
      clapFinished = true;
      finishIfReady();
    });
  };

  if (!('speechSynthesis' in window)) {
    speechFinished = true;
    playClap();
    return;
  }

  const randomIndex = Math.floor(Math.random() * shoutoutMessages.length);
  const selectedMessage = shoutoutMessages[randomIndex].replace(
    '{name}',
    agentName
  );

  const message = new SpeechSynthesisUtterance(selectedMessage);
  message.lang = 'en-IN';
  message.rate = 1;
  message.pitch = 1.1;
  message.volume = 1;

  message.onend = () => {
    speechFinished = true;
    finishIfReady();
  };

  message.onerror = () => {
    speechFinished = true;
    finishIfReady();
  };

  window.speechSynthesis.speak(message);
  window.setTimeout(playClap, 2000);
}
