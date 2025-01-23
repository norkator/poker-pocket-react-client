import React from 'react';
import styled from 'styled-components';

const imgFolder = './assets/images/';

export const getResource = (medalName) => {
  return `${imgFolder}${medalName}.png`;
};

const AchievementFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  justify-content: center;
  margin: 20px;
`;

const AchievementContainer = styled.div`
  text-align: center;
  position: relative;
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MedalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 80px;
`;

const MedalIcon = styled.div`
  width: 40px;
  height: 80px;
  background-color: #ccc;
  border: 2px solid #888;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  color: #444;
  cursor: pointer;
  background-image: ${({ image }) => (image ? `url(${image})` : 'none')};
  background-size: cover;
  background-position: center;
  &:hover {
    background-color: #f0ad4e;
    color: #fff;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  visibility: hidden;
  opacity: 0;
  transition:
    opacity 0.3s,
    visibility 0.3s;
  white-space: nowrap;

  ${AchievementContainer}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

const AchievementName = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #555;
`;

const Achievement = ({ name, icon, description }) => {
  const image = getResource(icon);

  return (
    <AchievementContainer>
      <MedalWrapper>
        <MedalIcon image={image}>{!image && name[0]}</MedalIcon>
      </MedalWrapper>
      <Tooltip>{description}</Tooltip>
      <AchievementName>{name}</AchievementName>
    </AchievementContainer>
  );
};

const Achievements = ({ achievements }) => {
  // const achievements = Array.from({ length: 9 }, (_, index) => ({
  //   name: `Test${index + 1}`,
  //   description: `Description for achievement ${index + 1}.`,
  // }));

  return (
    <AchievementFlex>
      {achievements.map((achievement, index) => (
        <Achievement
          key={index}
          name={achievement.name}
          icon={achievement.icon ? achievement.icon : 'shaded_medal_blank'}
          description={achievement.description}
        />
      ))}
    </AchievementFlex>
  );
};

export default Achievements;
