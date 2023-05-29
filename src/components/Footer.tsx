import {Container, Row, Col} from "react-bootstrap";


export const Footer = () => {
    return (
        <footer className="footer">
            <Container>
                <Row className="align-items-center">

                    <Col size={12} sm={6}>
                        <img src='/assets/img/logo.svg' alt="Logo"/>
                    </Col>
                    <Col size={12} sm={6} className="text-center text-sm-end">
                        <div className="social-icon">
                            <a href="#"><img src='/assets/img/nav-icon1.svg' alt="Icon"/></a>
                            <a href="#"><img src='/assets/img/nav-icon2.svg' alt="Icon"/></a>
                            <a href="#"><img src='/assets/img/nav-icon3.svg' alt="Icon"/></a>
                        </div>
                        <p>Muffin table/food reservation app.</p>
                        <div className={"d-flex flex-row gap-2 justify-content-end"}>
                            <a href={"/admin"} className={"text-decoration-none"}>Администрация</a>
                            <a href={"/management"} className={"text-decoration-none"}>Менеджмент</a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}