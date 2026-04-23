'use client';
import { useEffect } from 'react';

type Props = {
  description?: string;
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const PageContainer = ({ title, description, children }: Props) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);

  return <div>{children}</div>;
};

export default PageContainer;
