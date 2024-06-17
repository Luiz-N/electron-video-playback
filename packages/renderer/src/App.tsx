import {useState} from 'react';
import Container from '@mui/material/Container';
import {Box, Button, Stack, Typography} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {deleteVideo} from '#preload';
import {VideoList} from './components/VideoList';
import useVideoRecorder from './hooks/useVideoRecorder';
import DeleteIcon from '@mui/icons-material/Delete';
import StopIcon from '@mui/icons-material/Stop';
import SaveIcon from '@mui/icons-material/Save';
import type {Video} from './components/VideoList';

const App = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const {
    videoRef,
    isRecording,
    unsavedRecordingUrl,
    error,
    startRecording,
    stopRecording,
    deleteRecording,
    saveRecording,
  } = useVideoRecorder();

  const handleSaveRecording = async () => {
    const video = await saveRecording();
    if (video) {
      // check if any videos have the same path
      const replacedVideoIndex = videos.findIndex(v => v.path === video.path);
      if (replacedVideoIndex !== -1) {
        const newVideos = [...videos];
        newVideos[replacedVideoIndex] = video;
        setVideos(newVideos);
      } else {
        setVideos([video, ...videos]);
      }
      setSelectedVideo(video);
    }
  };

  const handleDeleteVideo = async (video: Video) => {
    await deleteVideo(video.path);
    const newVideos = videos.filter(v => v.path !== video.path);
    setVideos(newVideos);
    setSelectedVideo(newVideos[0] || null);
  };

  return (
    <Container sx={{marginTop: 2}}>
      <Grid
        container
        spacing={2}
      >
        <Grid xs={8}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Typography
              my={2}
              variant="h4"
              sx={{
                display: 'inline-block',
              }}
            >
              Video Recorder
            </Typography>
            <Button
              variant="contained"
              sx={{
                display: 'inline-block',
                visibility: selectedVideo ? 'visible' : 'hidden',
              }}
              onClick={() => setSelectedVideo(null)}
            >
              Create New Recording
            </Button>
          </Box>
          {error && (
            <Typography
              color="error"
              mb={2}
            >
              {error}
            </Typography>
          )}
          <video
            ref={videoRef}
            controls={!isRecording}
            autoPlay={isRecording}
            width="100%"
            src={selectedVideo ? `media://${selectedVideo.path}` : unsavedRecordingUrl || ''}
          />
          {!selectedVideo ? (
            <Stack
              spacing={2}
              my={1}
            >
              {!isRecording && !unsavedRecordingUrl && (
                <Button
                  variant="contained"
                  onClick={startRecording}
                >
                  Start Recording
                </Button>
              )}
              {isRecording && (
                <Button
                  variant="contained"
                  startIcon={<StopIcon />}
                  onClick={stopRecording}
                  color="error"
                >
                  Stop Recording
                </Button>
              )}
              {unsavedRecordingUrl && (
                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  onClick={deleteRecording}
                  color="error"
                >
                  Delete Recording
                </Button>
              )}
              {unsavedRecordingUrl && (
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveRecording}
                >
                  Save Recording
                </Button>
              )}
            </Stack>
          ) : (
            <div>
              <Typography variant="h5">{selectedVideo.name}</Typography>
              <Typography variant="subtitle1">
                {(selectedVideo.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
              <Typography variant="subtitle1">
                {selectedVideo.createdAt.toLocaleString()}
              </Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteVideo(selectedVideo)}
                sx={{
                  marginTop: 2,
                }}
              >
                Delete
              </Button>
            </div>
          )}
        </Grid>
        <Grid xs={4}>
          <VideoList
            videos={videos}
            selectedVideo={selectedVideo}
            onSelect={setSelectedVideo}
            onDelete={handleDeleteVideo}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
