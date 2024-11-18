import { NodeBody } from '@/routes/_layout/contacts-list/index';
import { Button } from '@telegram-apps/telegram-ui';
import { useEffect, useState } from 'react';
import TelegramHelper from '@/lib/utils/telegram/telegram-helper';

export const Contact = ({ node }: { node: NodeBody }) => {
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    TelegramHelper.getProfileAvatar(node.username).then((avatarBlobUrl) => {
      setAvatarUrl(avatarBlobUrl);
    });
  }, []);

  return (
    <Button mode={'plain'} stretched={true} style={{ padding: 0 }}>
      <div className={`flex px-4 min-h-20 justify-center text-sm relative`}>
        <div className="h-20 flex items-center">
          <img
            loading="lazy"
            src={avatarUrl}
            className="h-14 min-w-14 rounded-full"
            alt=""
          />
        </div>
        <div className="h-full ml-4 w-full ">
          <div className={'h-full flex items-center w-full py-2'}>
            <div className="w-full py-2">
              <div className="flex w-full">
                <div className="font-medium">{node.id}</div>
                {node.topic && (
                  <div className="ml-auto text-link rounded-xl text-xs flex items-center justify-center font-medium">
                    <span>{node.topic}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-1 flex-wrap mt-4">
                {node.tags &&
                  node.tags.map((tag) => (
                    <span
                      className={`px-2 py-[0.5px]  text-xs text-black font-normal bg-buttonBezeled text-link rounded-xl`}
                      key={tag.title}
                    >
                      {tag.title}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          <div className="bg-divider h-[1px] absolute bottom-0 w-full"></div>
        </div>
      </div>
    </Button>
  );
};
