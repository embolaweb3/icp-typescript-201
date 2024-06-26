import React, { useEffect, useCallback, useState } from "react";
import { Container, Nav,Row,Col } from "react-bootstrap";
import "./App.css";
import './styles/tailwind.css'
import Wallet from "./components/Wallet";
import coverImg from "./assets/img/sandwich.jpg";
import { login, logout as destroy } from "./utils/auth";
import { balance as principalBalance } from "./utils/ledger"
import Cover from "./components/utils/Cover";
import { Notification } from "./components/utils/Notifications";
import RegisterUserForm from "./components/marketplace/RegisterUser";
import Campaigns from "./components/marketplace/Campaigns";
import CreateCampaignForm from "./components/marketplace/CreateCampaign";


const App = function AppWrapper() {
    const isAuthenticated = window.auth.isAuthenticated;
    const principal = window.auth.principalText;

    const [balance, setBalance] = useState("0");

    const getBalance = useCallback(async () => {
        if (isAuthenticated) {
            setBalance(await principalBalance());
        }
    });

    useEffect(() => {
        getBalance();
    }, [getBalance]);

    return (
        <>
            <Notification />
            {isAuthenticated ? (
                <Container fluid="md">
                    <Nav className="justify-content-end pt-3 pb-5">
                        <Nav.Item>
                            <Wallet
                                principal={principal}
                                balance={balance}
                                symbol={"ICP"}
                                isAuthenticated={isAuthenticated}
                                destroy={destroy}
                            />
                        </Nav.Item>
                    </Nav>
                    <Row>
                        <Col md={6}>
                            <RegisterUserForm />
                        </Col>
                        <Col md={6} className="shadow p-2">
                            <CreateCampaignForm />
                        </Col>
                    </Row>

                  <Campaigns />
                </Container>
            ) : (
                <Cover name="Campaign" login={login} coverImg={coverImg} />
            )}
        </>
    );
};

export default App;