/**
 * @module preload
 */

import {sha256sum} from './nodeCrypto.js';
import {versions} from './versions.js';
import {ipcRenderer} from 'electron';
export {sha256sum, versions};

// TODO: Centralize type definitions to avoid duplication between here and renderedr & main
type Video = {
  path: string;
  name: string;
  size: number;
  createdAt: Date;
};

const saveVideo = async (videoUrl: string): Promise<Video> => {
  const response = await fetch(videoUrl);
  const blob = await response.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  const video = await ipcRenderer.invoke('save-video', buffer);
  return video;
};

const deleteVideo = async (filePath: string) => {
  await ipcRenderer.invoke('delete-video', filePath);
};

export {saveVideo, deleteVideo};
