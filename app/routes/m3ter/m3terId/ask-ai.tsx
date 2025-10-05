import { Mic, Plus, Send } from "lucide-react";

function AskAi() {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <h2 className="text-[30px]">What can I help you with?</h2>
      <div className="md:w-[70%] w-[90%] shadow-xl mt-[150px] md:mt-[200px] bg-secondary rounded-[40px] p-4 flex items-center h-[139px]">
        <button
          className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Add attachment"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
        <textarea
          className="border-0 max-h-[139px]  px-3 outline-0 w-full resize-none"
          placeholder="Ask M3ter Ai"
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Microphone Button */}
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Voice input"
          >
            <Mic className="w-5 h-5 text-gray-600" />
          </button>

          {/* Send Button */}
          <button
            className={`p-2 rounded-lg transition-colors`}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid w-full lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-[200px] place-items-center">
        <div className="w-fit px-4 h-[48px] rounded-[35px] border border-[#D89156] flex items-center justify-center">
          <p>Why is my meter not working?</p>
        </div>
        <div className="w-fit px-4 h-[48px] rounded-[35px] border border-[#D89156] flex items-center justify-center">
          <p>How do i access my meter activities</p>
        </div>
        <div className="w-fit px-4 h-[48px] rounded-[35px] border border-[#D89156] flex items-center justify-center">
          <p>Why is my meter not working?</p>
        </div>
      </div>
    </div>
  );
}

export default AskAi;
