'use client';
import NavbarLines from '@/components/Navbar/Lines/NavbarLines';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { AuthUser } from '@/utils/types';
import { useOnClickOutside } from '@/utils/hooks';
import { buildApiUrl, getCsrfToken } from '@/utils';
// @ts-ignore The current file is a CommonJS module whose imports will produce 'require' calls;
import { env } from '@/env.mjs';
import styles from './AuthenticatedUser.module.scss';

type Props = {
  user: AuthUser;
};

export default function AuthenticatedUser({ user }: Props) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const userContainerRef = useRef<HTMLButtonElement | null>(null);
  const [showMenu, setShowMenuState] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showChangeDiscordAccountModal, setShowChangeDiscordAccountModal] = useState(false);

  useOnClickOutside({
    ref: menuRef,
    ignoreRef: userContainerRef,
    onClick: closeMenu
  });

  function toggleMenu() {
    setShowMenuState((showMenu) => !showMenu);
  }

  function closeMenu() {
    setShowMenuState(false);
  }

  function closeAllModals() {
    setShowDeleteAccountModal(false);
    setShowChangeDiscordAccountModal(false);
  }

  async function logout() {
    let resp: Response | undefined;
    const url = buildApiUrl('/auth/session/logout');

    try {
      resp = await fetch(url, {
        credentials: 'include'
      });
    } catch(err) {
      console.error(err);
    }
    
    
    if (!resp?.ok) {
      const data = await resp?.text();
      console.info('Response: ' + data);
      // TODO: Display error to user
      return;
    }

    setShowMenuState(false);
    location.reload();
  }

  async function promptAccountDeletion() {
    closeMenu();
    setShowDeleteAccountModal(true);
  }

  async function promptDiscordAccountChange() {
    closeMenu();
    setShowChangeDiscordAccountModal(true);
  }

  async function deleteAccount() {
    let resp: Response | undefined;
    const url = buildApiUrl('/auth/session/delete_account');
    const csrf = getCsrfToken();

    if (!csrf) {
      console.warn('CSRF token not found. Stopping execution');
      return;
    }

    try {
      resp = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          'X-CSRFToken': csrf
        }
      });
    } catch(err) {
      console.error(err);
    }

    if (!resp?.ok) {
      const data = await resp?.text();
      console.info('Response: ' + data);
      console.info('CSRF token: ' + csrf)
      // TODO: Display error to user
      return;
    }

    closeAllModals();
    location.reload();
  }

  function changeDiscordAccount() {
    location.href = `${env.NEXT_PUBLIC_ORIGIN}/api/auth/discord`;
  }

  return (
    <>
      {showChangeDiscordAccountModal ? (
        <div className='backdrop'>
          <div className='modal'>
            <h2>Change Discord Account</h2>
            <p>If you need to change the Discord account linked to your 5WC account (and therefore, registration), then you need to log in again.</p>
            <div className='btn-container'>
              <button className='btn btn-primary' onClick={changeDiscordAccount}>
                Log In
              </button>
              <button className='btn' onClick={closeAllModals}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : undefined}
      {showDeleteAccountModal ? (
        <div className='backdrop'>
          <div className='modal'>
            <h2>Delete Account</h2>
            <p>Are you sure you want to delete your 5WC account? This also means that you're registration is removed from the tournament, regardless if you're part of a team or not.</p>
            <div className='btn-container'>
              <button className='btn btn-error' onClick={deleteAccount}>
                Delete
              </button>
              <button className='btn' onClick={closeAllModals}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : undefined}
      {showMenu ? (
        <div ref={menuRef} className={styles.menu}>
          <ul>
          <li>
              <button onClick={promptDiscordAccountChange}>
                Change Discord Account
              </button>
            </li>
            <li>
              <button onClick={promptAccountDeletion}>
                Delete Account
              </button>
            </li>
          </ul>
          <div className={styles.divider} />
          <button className='btn btn-primary' onClick={logout}>
            Logout
          </button>
        </div>
      ) : undefined}
      <div className={styles.container}>
        <NavbarLines />
        <button ref={userContainerRef} className={styles.userBtn} onClick={toggleMenu}>
          <Image
            src="/user-bg-deco.png"
            alt="user bg deco"
            width={272}
            height={90}
            className={styles.bgDeco}
          />
          <div className={styles.container}>
            <Image
              src={user.osu.avatar_url}
              alt="authenticated user profile pic"
              width={58}
              height={58}
              quality={80}
              className={styles.pfp}
            />
            <div className={styles.rightContainer}>
              <span className={styles.username}>{user.osu.username}</span>
              <div className={styles.lines}>
                <div className={styles.grayLine} />
                <div className={styles.grayLine} />
                <div className={styles.whiteLine} />
                <div className={styles.whiteLine} />
              </div>
            </div>
          </div>
        </button>
      </div>
    </>
  );
}
