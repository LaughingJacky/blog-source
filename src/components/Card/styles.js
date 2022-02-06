import styled from 'styled-components'

const theme = {
  colors: {
    blue: '#1b4d89',
    lightBlue: '#7395ea',
    grey: '#808080',
    tea: '#008080',
    orange: '#fc4445',
    lightOrange: '#ff7374',
  },
}

export const UserCard = styled.div`
  width: 300px;
  height: 300px;
  text-align: center;
  margin: 10px;
  box-shadow: 0px 9px 7px -1px rgba(0, 0, 0, 0.16);
  border-radius: 7px;
  background-color: ${theme.colors.tea};
  transition: all ease 0.5s;
  :hover {
    opacity: 0.7;
    cursor: pointer;
    transform: translateY(-5px);
  }
`

export const Cardheader = styled.div`
  background: ${theme.colors.blue};
  height: 100px;
  padding: 15px 8px 0px 8px;
  border-radius: 7px 7px 0px 0px;
  text-align: center;
`

export const StyledImg = styled.img`
  height: 110px;
  width: 110px;
  border-radius: 60px;
  align-items: center;
  margin-top: -50px;
  border: 3px solid white;
`

export const UserName = styled.label`
  color: white;
  font-size: 20px;
  font-weight: bold;
`

export const InfoContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
`

export const InfoLabel = styled.label`
  margin-top: 10px;
`
