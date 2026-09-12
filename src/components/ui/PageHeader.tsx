import React from 'react';
import BackButton from './BackButton';

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  backHref?: string;
  actions?: React.ReactNode;
  insideContainer?: boolean;
};

export default function PageHeader({ title, subtitle, backHref, actions, insideContainer }: Props){
  if (insideContainer) {
    return (
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-center gap-4">
          {backHref !== undefined && <BackButton href={backHref} />}
          <div>
            {subtitle}
            <h1 className="text-3xl font-bold text-ink-700">{title}</h1>
          </div>
        </div>
        <div>
          {actions}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {backHref !== undefined && <BackButton href={backHref} />}
          <div>
            {subtitle}
            <h1 className="text-2xl font-bold text-ink-50">{title}</h1>
          </div>
        </div>
        <div>
          {actions}
        </div>
      </div>
    </div>
  );
}
