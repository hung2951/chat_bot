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
import { MdCancel, MdVolumeDown } from "react-icons/md";
import { config, Demo } from "./api";
import ReactLoading from "react-loading";
const Dictaphone = () => {
  const [question, setQuestion] = useState("");
  const [id, setId] = useState("");
  const [arrContent, setArrContent] = useState([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
        { answer: content.data.answer, audioId: content.data.audio_id,question:transcript },
      ]);
      setLoading(false);
      console.log(content.data.answer, "session_id:", content.data.session_id);
      console.log("content:", arrContent);
    } catch (error) {
      alert(error, "Vui lòng gửi lại câu hỏi!");
      setLoading(false);
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
      {loading == true ? (
        <div className="loading">
          <ReactLoading type={"spinningBubbles"} color="#004a4a" />
        </div>
      ) : (
        <main>
          <h1>Misaplus giải đáp những thắc mắc của bạn</h1>
          <div className="content">
            <div className="question">
              {transcript && <p>Trả lời cho câu hỏi: {transcript}</p>}
            </div>
            {arrContent?.map((item, index) => (
              <div className="content-item" key={index + 1}>
                <p><span>Câu hỏi:</span> <span className="content-item-question">{item.question}</span><br /> <br /> <span>Trả lời:</span> {item.answer}</p>
                <div className="listen" onClick={() => Listen(item.audioId)}>
                  <MdVolumeDown />
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* end content */}
      {/* action */}
      <div className="footer">
        <form onSubmit={onSubmit}>
          <input
            type="text"
            defaultValue={transcript}
            onChange={onHandleValue}
            readOnly
          />

          {loading ? (
            <div className="activeSend">
              <BsFillSendFill />
            </div>
          ) : (
            <button>
              <BsFillSendFill />
            </button>
          )}
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
