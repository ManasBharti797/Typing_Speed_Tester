// SpeedTypingGame.js

import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import './SpeedTypingGame.css';
import TypingArea from './TypingArea'; // Import the TypingArea component

const SpeedTypingGame = () => {
   const paragraphs = [
    `A plant is one of the most important living things that 
    develop on the earth and is made up of stems, leaves, 
    roots, and so on. Parts of Plants: The part of the plant
    that developed beneath the soil is referred to as root 
    and the part that grows outside of the soil is known as shoot.
    The shoot consists of stems, branches, leaves, fruits, 
    and flowers. Plants are made up of six main parts: roots, stems,
    leaves, flowers, fruits, and seeds.`,

    `The root is the part of the plant that grows in the soil. 
    The primary root emerges from the embryo. Its primary
    function is to provide the plant stability in the earth
    and make other mineral salts from the earth available to the plant
    for various metabolic processes. There are three types of roots i.e. Tap Root, 
    Adventitious Roots, and Lateral Root. The roots arise from 
    the parts of the plant and not from the rhizomes roots.`,

    `Stem is the posterior part that remains above the ground 
    and grows negatively geotropic. Internodes and nodes are 
    found on the stem. Branch, bud, leaf, petiole, flower, and
    inflorescence on a node are all those parts of the plant 
    that remain above the ground and undergo negative subsoil 
    development. The trees have brown bark and the young and
    newly developed stems are green. The roots arise from the 
    parts of plant and not from the rhizomes roots.`,

    `It is the blossom of a plant. A flower is the part of a plant 
    that produces seeds, which eventually become other flowers. They 
    are the reproductive system of a plant. Most flowers consist of 
    04 main parts that are sepals, petals, stamens, and carpels.
    The female portion of the flower is the carpels. The majority 
    of flowers are hermaphrodites,
    meaning they have both male and female components. Others may 
    consist of one of two parts and may be male or female.`,

    `An aunt is a bassoon from the right perspective. 
    As far as we can estimate, some posit the melic myanmar to 
    be less than kutcha. One cannot separate foods from blowzy bows.
    The scampish closet reveals itself as a sclerous llama to 
    those who look. A hip is the skirt of a peak. Some hempy laundries 
    are thought of simply as orchids. A gum is a trumpet from 
    the right perspective. A freebie flight is a wrench of the mind. Some
    posit the croupy.`
];

 const maxTime = 60;

  const [typingText, setTypingText] = useState([]);
  const [inpFieldValue, setInpFieldValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [WPM, setWPM] = useState(0);
  const [CPM, setCPM] = useState(0);

  const inputRef = useRef(null);
  const intervalRef = useRef(null);

  const loadParagraph = () => {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    const content = Array.from(paragraphs[ranIndex]).map((letter, index) => (
      <span
        key={index}
        className={`char ${index === 0 ? 'active' : ''}`}
        style={{ color: letter !== ' ' ? 'black' : 'transparent' }}
      >
        {letter !== ' ' ? letter : '_'}
      </span>
    ));

    setTypingText(content);
    setInpFieldValue('');
    setCharIndex(0);
    setMistakes(0);
    setIsTyping(false);
    setTimeLeft(maxTime);
    setWPM(0);
    setCPM(0);
  };

  useEffect(() => {
    loadParagraph();

    const handleGlobalKey = () => {
      inputRef.current?.focus();
    };

    document.addEventListener('keydown', handleGlobalKey);

    return () => {
      document.removeEventListener('keydown', handleGlobalKey);
    };
  }, []);

  useEffect(() => {
    if (isTyping && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isTyping]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsTyping(false);
      clearInterval(intervalRef.current);
    }

    if (isTyping && timeLeft > 0) {
      const timeElapsed = maxTime - timeLeft;
      const correctChars = charIndex - mistakes;

      const cpm = Math.max(0, Math.floor(correctChars * (60 / timeElapsed)));
      const wpm = Math.max(0, Math.round((correctChars / 5) / (timeElapsed / 60)));

      setCPM(isFinite(cpm) ? cpm : 0);
      setWPM(isFinite(wpm) ? wpm : 0);
    }
  }, [timeLeft, isTyping, charIndex, mistakes]);

  const handleKeyDown = (event) => {
    const characters = document.querySelectorAll('.char');

    if (event.key === 'Backspace' && charIndex > 0 && timeLeft > 0) {
      characters[charIndex].classList.remove('active');

      const newCharIndex = charIndex - 1;
      characters[newCharIndex].classList.remove('correct', 'wrong');
      characters[newCharIndex].classList.add('active');

      if (characters[newCharIndex].classList.contains('wrong')) {
        setMistakes(prev => Math.max(prev - 1, 0));
      }

      setCharIndex(newCharIndex);
      setInpFieldValue(prev => prev.slice(0, -1));
    }
  };

  const initTyping = (event) => {
    const characters = document.querySelectorAll('.char');
    const typedChar = event.target.value.slice(-1);
    const currentCharElement = characters[charIndex];
    let currentChar = currentCharElement?.innerText;

    if (currentChar === '_') currentChar = ' ';

    if (!isTyping && timeLeft > 0) {
      setIsTyping(true);
    }

    if (charIndex < characters.length && timeLeft > 0) {
      if (typedChar === currentChar) {
        currentCharElement.classList.add('correct');
      } else {
        currentCharElement.classList.add('wrong');
        setMistakes(prev => prev + 1);
      }

      currentCharElement.classList.remove('active');
      if (charIndex + 1 < characters.length) {
        characters[charIndex + 1].classList.add('active');
      }

      setCharIndex(prev => prev + 1);
      setInpFieldValue(event.target.value);
    } else {
      setIsTyping(false);
    }
  };

  const resetGame = () => {
    clearInterval(intervalRef.current);
    loadParagraph();
  };

  return (
    <div className="container">
      <input
        type="text"
        className="input-field"
        ref={inputRef}
        value={inpFieldValue}
        onChange={initTyping}
        onKeyDown={handleKeyDown}
        spellCheck="false"
        autoComplete="off"
      />
      <TypingArea
        typingText={typingText}
        inpFieldValue={inpFieldValue}
        timeLeft={timeLeft}
        mistakes={mistakes}
        WPM={WPM}
        CPM={CPM}
        initTyping={initTyping}
        handleKeyDown={handleKeyDown}
        resetGame={resetGame}
      />
    </div>
  );
};

export default SpeedTypingGame;
