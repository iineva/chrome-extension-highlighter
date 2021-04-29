import "./App.css";
import * as AssetsService from "./services/assets-service";
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useState, useEffect } from 'react';
import virtualizedRenderer from './virtualizedRenderer'; 
import Header from './Header';

function App() {

  const pre = document.body.querySelector("pre")
  const [showRaw, setShowRaw] = useState(false)
  const [codeString, setCodeString] = useState(pre && pre.textContent)
  const [htmlOrgBg] = useState(document.querySelector("html")!.style.background)
  const [theme, setTheme] = useState(Header.getDefaultTheme())
  const [language, setLanguage] = useState(Header.getDefaultLanguage())
  const [showLineNumbers, setShowLineNumbers] = useState(Header.getDefaultShowLineNumbers())

  useEffect(() => {
    if (pre) {
      pre.hidden = !showRaw
    }
    if (showRaw) {
      document.querySelector("html")!.style.background = htmlOrgBg
    } else {
      document.querySelector("html")!.style.background = theme?.value.hljs.background
    }
    document.body.style.padding = "0";
    document.body.style.margin = "0";

    const observer = new MutationObserver(function(mutations){
      setCodeString(pre && pre.textContent)
    })
    observer.observe(pre!, { 
      childList: true,
      characterData: true,
      subtree: true, // needed if the node you're targeting is not the direct parent
    })
    return () => {
      observer.disconnect()
    }
  }, [showRaw, theme]);

  return (
    <div className="App">
      <Header
        codeString={codeString}
        theme={theme} onThemeChange={(t) => {
          setTheme(t)
        }}
        language={language} onLanguageChange={(l) => {
          setLanguage(l)
        }}
        showLineNumbers={showLineNumbers} onShowLineNumbersChange={(s) => {
          setShowLineNumbers(s)
        }}
      />
      <SyntaxHighlighter
        language={language}
        customStyle={{
          margin: 0,
          boxSizing: "border-box",
          flex: 1,
        }}
        lineNumberStyle={{minWidth: "2.5em"}}
        style={theme?.value}
        showLineNumbers={showLineNumbers}
        showInlineLineNumbers={true}
        wrapLines={true}
        wrapLongLines={true}
        renderer={virtualizedRenderer({overscanRowCount: 100, autoFocus: true})}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}

export default App;
