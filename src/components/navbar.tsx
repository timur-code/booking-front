import React, {useState, useContext, useEffect, FormEvent} from 'react';
import {Navbar, Container, Nav, NavDropdown} from 'react-bootstrap';
import LoginModal from "@component/modals/login";
import IUser from "@component/models/IUser";
import userApi from "@component/mixin/userApi";

const ReNavBar = () => {
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        getUser()
    }, [user]);

    const getUser = () => {
        const userData = localStorage.getItem('me');
        if (userData) {
            setUser(JSON.parse(userData) as IUser);
        }
    }

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLogout = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const data = await userApi.logout();
            console.log("Login success: ", data);
            // Redirect to the dashboard or another protected page
        } catch (err: any) {
            console.error(err.message || 'An error occurred during logout.');
        }
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">Booking</Navbar.Brand>
                <Navbar.Toggle/>
                <Navbar.Collapse>
                    <Nav className="w-100 d-flex justify-content-end">
                        <Nav.Link href="/">Главная</Nav.Link>
                        {!user && <Nav.Link onClick={handleOpenModal}>Войти</Nav.Link>}
                        {user && (
                            <NavDropdown title={user.firstName} id="user-dropdown">
                                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
            <LoginModal show={showModal} onClose={handleCloseModal}/>
        </Navbar>
    );
};

export default ReNavBar;