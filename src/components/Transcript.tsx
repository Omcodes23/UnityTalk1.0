import { useRef, useEffect } from "react";
import { AssemblyAI } from 'assemblyai';
import { TranscriberData } from "../hooks/useTranscriber";
import { formatAudioTimestamp } from "../utils/AudioUtils";

interface Props {
    transcribedData: TranscriberData | undefined;
}

export default function Transcript({ transcribedData }: Props) {
    const divRef = useRef<HTMLDivElement>(null);
    const assemblyAI = new AssemblyAI({ apiKey: 'e795d6cd880847eaaf66863a5bbc8ac8' }); 

    const saveBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const transcribeAudio = async (audioUrl: string) => {
        try {
            const transcript = await assemblyAI.transcripts.transcribe({ audio_url: audioUrl });
            console.log(transcript.text); // Log the transcript text
        } catch (error) {
            console.error('Error transcribing audio:', error);
        }
    };

    const exportTXT = () => {
        let chunks = transcribedData?.chunks ?? [];
        let text = chunks
            .map((chunk) => chunk.text)
            .join("")
            .trim();

        const blob = new Blob([text], { type: "text/plain" });
        saveBlob(blob, "transcript.txt");
    };

    const exportJSON = () => {
        let jsonData = JSON.stringify(transcribedData?.chunks ?? [], null, 2);

      
        const regex = /(    "timestamp": )\[\s+(\S+)\s+(\S+)\s+\]/gm;
        jsonData = jsonData.replace(regex, "$1[$2 $3]");

        const blob = new Blob([jsonData], { type: "application/json" });
        saveBlob(blob, "transcript.json");
    };
    
    const speakTranscript = async () => {
    
        if (transcribedData && transcribedData.text && transcribedData.text.trim() !== '') {
            const text = transcribedData.text.trim();
            try {
                
                const speechSynthesis = window.speechSynthesis;
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'en-US'; 
                speechSynthesis.speak(utterance);
            } catch (error) {
                console.error('Error speaking transcript:', error);
            }
        } else {
            console.error('Error: No valid transcript text provided.');
        }
    };
    

    // Scroll to the bottom when the component updates
    useEffect(() => {
        if (divRef.current) {
            const diff = Math.abs(
                divRef.current.offsetHeight +
                divRef.current.scrollTop -
                divRef.current.scrollHeight,
            );

            if (diff <= 64) {
                // We're close enough to the bottom, so scroll to the bottom
                divRef.current.scrollTop = divRef.current.scrollHeight;
            }
        }
    });

    return (
        <div
            ref={divRef}
            className='w-full flex flex-col my-2 p-4 max-h-[20rem] overflow-y-auto'
        >
            {transcribedData?.chunks &&
                transcribedData.chunks.map((chunk, i) => (
                    <div
                        key={`${i}-${chunk.text}`}
                        className='w-full flex flex-row mb-2 bg-white rounded-lg p-4 shadow-xl shadow-black/5 ring-1 ring-slate-700/10'
                    >
                        <div className='mr-5'>
                            {formatAudioTimestamp(chunk.timestamp[0])}
                        </div>
                        {chunk.text}
                    </div>
                ))}
            {transcribedData && !transcribedData.isBusy && (
                <div className='w-full text-right'>
                    <button
                        onClick={exportTXT}
                        className='text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 inline-flex items-center'
                    >
                        Export TXT
                    </button>
                    <button
                        onClick={exportJSON}
                        className='text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 inline-flex items-center'
                    >
                        Export JSON
                    </button>
                    <button
                        onClick={speakTranscript}
                        className='text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 inline-flex items-center'
                    >
                        Speak Transcript
                    </button>
                </div>
            )}
        </div>
    );
}
