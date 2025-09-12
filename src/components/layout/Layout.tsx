interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout = ({ children, title }: LayoutProps) => (
  <div className="layout">
    <header className="header">
      <h1 className="title">{title || "Error Find Quiz"}</h1>
    </header>
    <main className="main">{children}</main>
    <footer className="footer">
      <p>Error Find Quiz Application</p>
    </footer>
  </div>
);
