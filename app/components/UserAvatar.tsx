import {Form} from "@remix-run/react";
import {useEffect, useRef, useState} from "react";

type UserAvatarProps = {
  username: string;
};

export const UserAvatar = ({username}: UserAvatarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return isClient ? (
    <div ref={avatarRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full opacity-50 bg-emerald-600 text-white 
                 flex items-center justify-center text-lg font-medium
                 hover:bg-emerald-700 hover:opacity-100 transition-colors duration-200"
      >
        {username[0].toUpperCase()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="px-4 pb-1 border-b border-gray-200">
            <span className="text-sm text-gray-500 cursor-default">
              {username}
            </span>
          </div>
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </Form>
        </div>
      )}
    </div>
  ) : null;
};
