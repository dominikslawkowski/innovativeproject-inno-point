import styled from "styled-components";
import { Spinner } from "../../../components";

export const StyledSpinner = styled(Spinner)`
  margin-left: auto;
  margin-right: auto;
  margin-top: calc(50vh - 50px);
`;

export const MainContainer = styled.div`
  padding: 100px;
  display: grid;
  grid-template: "main main" "goals scopes" "techno tags" "verify delete" / 1fr 1fr;
`;
