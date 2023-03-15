import "regenerator-runtime";
import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  BsFillMicFill,
  BsStopCircleFill,
  BsFillSendFill,
} from "react-icons/bs";
import { MdCancel,MdVolumeDown } from "react-icons/md";
import { config, Demo } from "./api";
const Dictaphone = () => {
  const [question, setQuestion] = useState("");
  const [id, setId] = useState("");
  const [arrContent, setArrContent] = useState([]);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  if (!browserSupportsSpeechRecognition) {
    return <span>Trình duyệt không hỗ trợ nhận dạng giọng nói.</span>;
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    SpeechRecognition.stopListening();
    try {
      let content = await Demo({
        session_id: id,
        question: transcript,
      });
      setId(content.data.session_id);
      setArrContent([
        ...arrContent,
        { answer: content.data.answer, audioId: content.data.audio_id },
      ]);
      console.log(content.data.answer, "session_id:", content.data.session_id);
      console.log("content:", arrContent);
    } catch (error) {
      alert(error, "Vui lòng gửi lại câu trả lời!");
    }
  };
  const onHandleValue = (e) => {
    setQuestion(e.target.value);
    console.log(e.target.value);
  };
  const Listen = (audio_id) => {
    var audio = new Audio(
      `https://demo-onetouch-chat-api-h5gp4ab26q-uc.a.run.app/audio/${audio_id}`
    );
    audio.play();
  };
  return (
    <div className="container">
      {/* content */}
      <main>
        <div className="content">
          <div className="question">
            {transcript && <p>Trả lời cho câu hỏi: {transcript}</p>}
          </div>
          {arrContent?.map((item, index) => (
            <div className="content-item" key={index + 1}>
              <p>{item.answer}</p>
              <div className="listen" onClick={() => Listen(item.audioId)}><MdVolumeDown/></div>
            </div>
          ))}
        </div>
      </main>
      {/* end content */}
      {/* action */}
      <div className="footer">
        <form onSubmit={onSubmit}>
          <input
            type="text"
            defaultValue={transcript}
            onChange={onHandleValue} readOnly
          />
          <button>
            <BsFillSendFill />
          </button>
        </form>
        {/* <p>Microphone: {listening ? "on" : "off"}</p> */}
        <div className="btn-void">
          <button
            onClick={() =>
              SpeechRecognition.startListening({ language: "vi-VN" })
            }
            className={listening ? "voidActive" : ""}
          >
            <BsFillMicFill />
          </button>
          <button onClick={() => SpeechRecognition.stopListening()}>
            <BsStopCircleFill />
          </button>
          <button onClick={() => resetTranscript()}>
            <MdCancel />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Dictaphone;
