import React, {useState, useContext, useEffect, FormEvent} from 'react';
import {Navbar, Container, Nav, NavDropdown} from 'react-bootstrap';
import LoginModal from "@component/modals/login";
import IUser from "@component/models/IUser";
import userApi from "@component/mixin/userApi";
import logo from '../../public/assets/img/logo.svg';
import navIcon1 from '../../public/assets/img/nav-icon1.svg';
import navIcon2 from '../../public/assets/img/nav-icon2.svg';
import navIcon3 from '../../public/assets/img/nav-icon3.svg';
import {
    BrowserRouter as Router
} from "react-router-dom";

const NavBar = () => {
    const [activeLink, setActiveLink] = useState('home');
    const [scrolled, setScrolled] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        }
        window.addEventListener("scroll", onScroll);
        getUser()
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /*const onUpdateActiveLink = (value) => {
        setActiveLink(value);
    }*/
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
        <Navbar  className={scrolled ? "scrolled" : ""}>
            <Container>
                <Navbar.Brand href="/">
                    <img src='/assets/img/logo.svg' alt="Logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav">
                    <span className="navbar-toggler-icon"></span>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="/" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} >Главная</Nav.Link>
                        {!user && <Nav.Link onClick={handleOpenModal} className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'}>Войти</Nav.Link>}
                        {user && (
                            <NavDropdown title={user.firstName} id="user-dropdown">
                                {/*<NavDropdown.Item href="/profile">Профиль</NavDropdown.Item>*/}
                                <NavDropdown.Item onClick={handleLogout} >Выйти</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                    <span className="navbar-text">
              <div className="social-icon">
                <a href="#"><img src='/assets/img/nav-icon1.svg' alt="" /></a>
                <a href="#"><img src='/assets/img/nav-icon2.svg' alt="" /></a>
                <a href="#"><img src='/assets/img/nav-icon3.svg' alt="" /></a>
              </div>
            </span>
                </Navbar.Collapse>
            </Container>
            <LoginModal show={showModal} onClose={handleCloseModal}/>
        </Navbar>
    );
};

export default NavBar;