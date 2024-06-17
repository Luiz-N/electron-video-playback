import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material';

export type Video = {
  path: string;
  name: string;
  size: number;
  createdAt: Date;
};

interface VideoListProps {
  videos: Video[];
  onSelect: (video: Video) => void;
  onDelete: (video: Video) => void;
  selectedVideo: Video | null;
}

const VideoList = ({videos, onSelect, selectedVideo}: VideoListProps) => {
  const sortedVideos = videos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return (
    <List
      subheader={
        <ListSubheader
          component="div"
          id="nested-list-subheader"
          sx={{fontSize: '1.5rem'}}
        >
          Saved Videos
        </ListSubheader>
      }
    >
      {sortedVideos.length > 0 ? (
        sortedVideos.map((video, index) => (
          <ListItemButton
            component="li"
            key={video.path + index}
            selected={selectedVideo?.path === video.path}
            onClick={() => {
              onSelect(video);
            }}
            style={{cursor: 'pointer'}}
          >
            <>
              <ListItemText
                primary={video.name}
                primaryTypographyProps={{
                  variant: 'button',
                }}
                secondary={
                  <>
                    <Typography variant="caption">{video.createdAt.toLocaleString()}</Typography>
                    <Typography
                      variant="caption"
                      display="block"
                    >
                      {(video.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </>
                }
              />
            </>
          </ListItemButton>
        ))
      ) : (
        <ListItem key="no-videos">
          <ListItemText primary="No videos saved yet!" />
        </ListItem>
      )}
    </List>
  );
};

export {VideoList};
