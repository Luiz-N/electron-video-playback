import {saveVideo} from '#preload';
import {useState, useRef} from 'react';

const useVideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [unsavedRecordingUrl, setUnsavedRecordingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    if (unsavedRecordingUrl) {
      URL.revokeObjectURL(unsavedRecordingUrl);
      setUnsavedRecordingUrl(null);
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({video: true});
      videoRef.current!.srcObject = mediaStream;
      mediaRecorderRef.current = new MediaRecorder(mediaStream);
      const chunks: BlobPart[] = [];

      mediaRecorderRef.current.ondataavailable = e => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        (videoRef.current!.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        const blob = new Blob(chunks, {type: 'video/mp4'});
        const url = URL.createObjectURL(blob);
        setUnsavedRecordingUrl(url);
        videoRef.current!.srcObject = null;
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
      setUnsavedRecordingUrl(null);
      setError('Failed to start recording: ' + (error as Error).message);
    }
  };

  const saveRecording = async () => {
    if (!unsavedRecordingUrl) {
      return;
    }
    const savedVideo = await saveVideo(unsavedRecordingUrl).catch(error => {
      console.error('Failed to save video:', error);
      setError('Failed to save video: ' + (error as Error).message);
    });
    if (savedVideo) {
      URL.revokeObjectURL(unsavedRecordingUrl);
      setUnsavedRecordingUrl(null);
      return savedVideo;
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const deleteRecording = () => {
    if (unsavedRecordingUrl) {
      URL.revokeObjectURL(unsavedRecordingUrl);
      setUnsavedRecordingUrl(null);
    }
  };

  return {
    videoRef,
    isRecording,
    unsavedRecordingUrl,
    error,
    startRecording,
    stopRecording,
    deleteRecording,
    saveRecording,
  };
};

export default useVideoRecorder;
