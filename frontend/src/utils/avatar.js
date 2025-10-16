// src/utils/avatar.js
import * as Avatars from '@dicebear/avatars';
import * as sprites from '@dicebear/avatars-avataaars-sprites';

const avatarGenerator = new Avatars.default(sprites.default, {
  mood: ['happy', 'excited'],
  hairColor: ['blue', 'green', 'red'],
  accessories: ['glasses', 'earrings', 'hat'],
});

export const getAvatarSvg = (userId) => avatarGenerator.create(userId);
