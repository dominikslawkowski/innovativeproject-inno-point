import styled, { keyframes } from "styled-components";

const show = keyframes`
  from {
    transform: translateY(30px) scale(0.8);
    opacity: 0.4;
  }
`;

export const Container = styled.div`
  height: calc(100% - 100px);
  display: grid;
  grid-template: "panel main" / 250px auto;
  border-radius: 8px;
  box-shadow: 0px 0px 150px rgba(0, 0, 0, 0.25);
  transition: all 0.1s ease-in-out;
  margin: 50px;
  animation: ${show} 0.3s;

  div.Main {
    display: grid;
    grid-template: "name" 50px "desc" 100px "space" auto "back" 30px;
    padding: 20px;

    div.Name {
      letter-spacing: 3px;
      font-size: 30px;
    }

    div.Desc {
      color: gray;
      font-size: 20px;
    }

    a {
      justify-self: end;
      text-decoration: none;
      color: black;
    }
  }

  div.Panel {
    height: 100%;
    width: 250px;
    background: var(--gradientTop1);
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
`;
