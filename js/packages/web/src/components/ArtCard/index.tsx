import React from 'react';
import { Card, CardProps, Button, Badge } from 'antd';
import { MetadataCategory, StringPublicKey } from '@oyster/common';
import { ArtContent } from '../ArtContent';
import { useArt } from '../../hooks';
import { Artist, ArtType } from '../../types';
import { MetaAvatar } from '../MetaAvatar';

const { Meta } = Card;

export interface ArtCardProps extends CardProps {
  pubkey?: StringPublicKey;

  image?: string;
  animationURL?: string;
  animationObject?: object;
  onCreate?: boolean;
  onItems?: boolean;

  category?: MetadataCategory;

  name?: string;
  symbol?: string;
  description?: string;
  creators?: Artist[];
  preview?: boolean;
  small?: boolean;
  onClose?: () => void;

  height?: number;
  artView?: boolean;
  width?: number;

  count?: string;
}

export const ArtCard = (props: ArtCardProps) => {
  let {
    className,
    small,
    category,
    image,
    animationURL,
    animationObject,
    onCreate,
    onItems,
    name,
    preview,
    creators,
    description,
    onClose,
    pubkey,
    height,
    artView,
    width,
    count,
    ...rest
  } = props;
  const art = useArt(pubkey);
  creators = art?.creators || creators || [];
  name = art?.title || name || ' ';

  let badge = '';
  if (art.type === ArtType.NFT) {
    badge = 'Unique';
  } else if (art.type === ArtType.Master) {
    badge = 'NFT 0';
  } else if (art.type === ArtType.Print) {
    badge = `${art.edition} of ${art.supply}`;
  }

  const card = (
    <Card
      hoverable={true}
      className={`art-card ${small ? 'small' : ''} ${className ?? ''}`}
      {...rest}
    >
      {onClose && (
        <Button
          className="card-close-button"
          shape="circle"
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            onClose && onClose();
          }}
        >
          X
        </Button>
      )}
      <div className="art-card__header">
        <MetaAvatar creators={creators} size={32} />
        <div className="edition-badge">{badge}</div>
      </div>
      <div className="art-content__wrapper">
        <ArtContent
          pubkey={pubkey}
          uri={image}
          animationURL={animationURL}
          animation={animationObject}
          onCreate={onCreate}
          category={category}
          preview={preview}
          height={height}
          width={width}
          artView={artView}
          onItems={onItems}
        />
      </div>
      <Meta
        title={`${name}`}
        description={
          <>
            {/* {art.type === ArtType.Master && (
              <>
                <br />
                {!endAuctionAt && (
                  <span style={{ padding: '24px' }}>
                    {(art.maxSupply || 0) - (art.supply || 0)}/
                    {art.maxSupply || 0} prints remaining
                  </span>
                )}
              </>
            )} */}

            {count && (
              <div className="edition-badge">Selected count: {count}</div>
            )}
          </>
        }
      />
    </Card>
  );

  return art.creators?.find(c => !c.verified) ? (
    <Badge.Ribbon text="Unverified">{card}</Badge.Ribbon>
  ) : (
    card
  );
};
