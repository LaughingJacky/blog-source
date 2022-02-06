import React from 'react';

import {
  UserCard,
  Cardheader,
  StyledImg,
  UserName,
  InfoContainer,
  InfoLabel
} from "./styles";

export interface ICard {
  cardName: string;
  onClick: Function;
  imgSrc?: string;
  label: string;
  label2?: string;
}

const Card = ({ cardName, onClick = () => {}, imgSrc, label, label2 }: ICard) => {
  console.log(imgSrc);
  return (
    <UserCard
      onClick={onClick}
    >
      <Cardheader>
        <UserName>
          {cardName}
        </UserName>
      </Cardheader>
      {imgSrc ? <StyledImg src={imgSrc} alt={{}} /> : null}
      <InfoContainer>
        <InfoLabel>{label}</InfoLabel>
        {label2 ? <InfoLabel>{label2}</InfoLabel> : null}
      </InfoContainer>
    </UserCard>
  );
};

export default Card;
