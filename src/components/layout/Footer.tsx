import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex justify-center w-full border-t">
      <div className="flex flex-col md:flex-row w-full max-w-7xl items-center justify-between px-4 py-6 md:px-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} . 保留所有权利.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:underline"
          >
            关于我们
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:underline"
          >
            隐私政策
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:underline"
          >
            使用条款
          </Link>
        </div>
      </div>
    </footer>
  );
}
