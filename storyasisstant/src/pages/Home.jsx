import { Logo } from "../particles/Logo";
import { useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import catJam from "../images/catjam.webp";
import gun1 from "../images/gun_1.webp";
import ippyHappy from "../images/ippyhappy.webp";
import ippySad from "../images/ippysad.webp";
import pet2 from "../images/pet_2.webp";
import storyLogo from "../images/StoryLogo.webp";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const HomePage = () => {
  const [response, setResponse] = useState(() => {
    const savedChats = localStorage.getItem("chatHistory");
    return savedChats ? JSON.parse(savedChats) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const [copyValue, setCopyValue] = useState("Copy");

  const emojiMap = {
    ":StoryLogo:": storyLogo,
    ":gun_1:": gun1,
    ":ippyhappy:": ippyHappy,
    ":catjam:": catJam,
    ":ippysad:": ippySad,
    ":pet_2:": pet2,
  };

  useEffect(() => {
    if (response.length === 0) {
      setResponse([{ sender: "bot", text: "How can I help you?" }]);
    }
  }, [response.length]);

  useEffect(() => {
    if (response.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(response));
    }

    window.scrollTo({
      top: document.documentElement.scrollHeight + window.innerHeight,
      behavior: "smooth",
    });
  }, [response]);

  const url = "https://api.storyassistant.xyz/ask";

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    setValue(""); 
    setIsLoading(true);
    setIsDisabled(true);
    
    try {
      const userMessage = { sender: "user", text: value };
      setResponse((prev) => [...prev, userMessage]);
  
      const apiResponse = await axios.post(
        url,
        { message: value },
        { headers: { "Content-Type": "application/json" } }
      );
  
      const botMessage = { sender: "bot", text: apiResponse.data.answer };
      setResponse((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
  
      setResponse((prev) => [
        ...prev,
        { sender: "error", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
      setIsDisabled(false);
    }
  };
  
  const handleTextareaKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch(e);
    } else if (e.key === "Enter" && e.shiftKey) {
      const cursorPosition = e.target.selectionStart;
      const textBefore = value.slice(0, cursorPosition);
      const textAfter = value.slice(cursorPosition);

      setValue(`${textBefore}\n${textAfter}`);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = cursorPosition + 1;
      }, 0);
    }
  };

  const clearChat = () => {
    setResponse([]);
    localStorage.removeItem("chatHistory");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyValue("Copied");
      setTimeout(function() {
        setCopyValue("Copy");
      }, 1000);
    });
  };
  const renderMessageWithLinks = (text) => {
    const parts = text.split(/(\[.*?\]\(.*?\))/g); 
  
    return parts.map((part, index) => {
      if (part.match(/\[.*?\]\(.*?\)/)) {
        const match = part.match(/\[(.*?)\]\((.*?)\)/); 
        const linkText = match[1]; 
        const linkUrl = match[2];
  
        return (
          <a
            key={index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgb(241 224 206)", textDecoration: "underline" }}
          >
            {linkText}
          </a>
        );
      }
      return <span key={index}>{renderMessageWithEmojis(part)}</span>;
    });
  };
  const renderMessageWithCodeBlocks = (text) => {
    const parts = text.split(/(```[\s\S]*?```)/g); 
  
    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const codeBlock = part.slice(3, -3).trim(); 
        const firstLineEndIndex = codeBlock.indexOf("\n"); 
        let language = codeBlock.slice(0, firstLineEndIndex).trim(); 
        const code = codeBlock.slice(firstLineEndIndex + 1).trim(); 
        let finalLang;
        language === "jsx" ? finalLang = "javascript" : finalLang = language;

        return (
          <div key={index} className="code-block-container">
            <SyntaxHighlighter language={finalLang || "plaintext"} style={dracula}>
              {code}
            </SyntaxHighlighter>
            <button
              className="copy-button"
              onClick={() => copyToClipboard(code)}
            >
              {copyValue}
            </button>
          </div>
        );
      }
      return <span key={index}>{renderMessageWithLinks(part)}</span>; 
    });
  };
  

  const renderMessageWithEmojis = (text) => {
    const parts = text.split(/(:[a-zA-Z0-9_]+:)/g);

    return parts.map((part, index) => {
      if (emojiMap[part]) {
        return (
          <img
            key={index}
            src={emojiMap[part]}
            alt={part}
            style={{ width: "24px", height: "24px", verticalAlign: "middle" }}
          />
        );
      }
      return part;
    });
  };

  return (
    <div className="container">
      <nav className="nav">
        <Logo /> 
        <ul>
          <li>
            <a href="/explore">
              Check validator
            </a>
          </li>
          <li>
            <a href="/install-node">
              Install node
            </a>
          </li>
          <li>
            <a href="https://x.com/StoryProtocol" target="_blank" rel="noreferrer">
              Twitter / X
            </a>
          </li>
          <li>
            <a href="https://discord.gg/storyprotocol" target="_blank" rel="noreferrer">
              Discord
            </a>
          </li>
          <li>
            <a href="https://docs.story.foundation/" target="_blank" rel="noreferrer">
              Docs
            </a>
          </li>
        </ul>
      </nav>
      <main className="main">
        <div className="chat-history">
          {response.map((msg, index) => (
            <div
              key={index}
              className={clsx("message", {
                "message-user": msg.sender === "user",
                "message-bot": msg.sender === "bot",
                "message-error": msg.sender === "error",
              })}
            >
              {renderMessageWithCodeBlocks(msg.text)}
            </div>
          ))}
          {isLoading && (
            <div className="loading">
              <p className="generating">Generating...</p>
            </div>
          )}
        </div>
      </main>

      <div className="search__container">
        <div className="search">
          <form onSubmit={handleSearch} className="search__input">
            <textarea
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              value={value}
              name="chat"
              placeholder="Message for Story assistant"
            />
            <div className="search__input_nav">
              <button type="button" onClick={clearChat} disabled={isLoading}>
                Clear
              </button>
              <span className="xs-text">Powered by FTP</span>
              <button type="submit" disabled={isDisabled}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
