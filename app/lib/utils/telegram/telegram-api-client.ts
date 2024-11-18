'use client';

import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import bigInt from 'big-integer';
import Photo = Api.Photo;
import {Buffer} from "buffer";

class TelegramApiClient {
  private static instance: TelegramApiClient;

  private client: TelegramClient;

  private SESSION = new StringSession(import.meta.env.VITE_TELEGRAM_SESSION);
  private API_ID = Number(import.meta.env.VITE_TELEGRAM_API_ID);
  private API_HASH = import.meta.env.VITE_TELEGRAM_API_HASH;

  private avatarsQueue: (() => Promise<void>)[] = [];
  private downloadedAvatars = 0
  private isProcessingInAvatarQueue = false;

  private constructor() {
    this.client = new TelegramClient(this.SESSION, this.API_ID, this.API_HASH, {
      connectionRetries: 5,
    });
  }

  public async initialize(): Promise<void> {
    try {
      if (!this.client.connected) {
        await this.client.connect();
        console.log('Telegram client connected.');
      }
    } catch (error) {
      console.error('Failed to connect Telegram client:', error);
      throw error;
    }
  }

  async getPhoto(username: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const task = async () => {
        try {
          if (this.downloadedAvatars % 4 === 0 && this.downloadedAvatars !== 0) await new Promise((resolve) => setTimeout(resolve, 10_000));
          this.downloadedAvatars += 1

          const result = await this.client.invoke(
            new Api.photos.GetUserPhotos({
              userId: username,
            }),
          );

          const photo = result.photos[0] as Photo;
          const fr = photo.fileReference;

          const res = await this.client.downloadFile(
            new Api.InputPhotoFileLocation({
              id: photo.id,
              accessHash: photo.accessHash,
              fileReference: fr,
              thumbSize: 'c',
            }),
            {
              dcId: photo.dcId,
              fileSize: bigInt(829542),
            },
          );

          if (Buffer.isBuffer(res)) {
            resolve(res);
          } else {
            throw new Error('Failed to download photo as a Buffer');
          }
        } catch (error) {
          reject(error);
        } finally {
          this.processQueue();
        }
      };
      this.avatarsQueue.push(task);

      if (!this.isProcessingInAvatarQueue) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.avatarsQueue.length === 0) {
      this.isProcessingInAvatarQueue = false;
      return;
    }

    this.isProcessingInAvatarQueue = true;
    const nextTask = this.avatarsQueue.shift();
    if (nextTask) {
      await nextTask();
    }
  }

  public static getInstance() {
    if (!TelegramApiClient.instance) {
      TelegramApiClient.instance = new TelegramApiClient();
    }
    return TelegramApiClient.instance;
  }
}


export default TelegramApiClient;
