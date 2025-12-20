
import styles from "./page.module.css";
import PageLogin from "../../components/Login";


export default function Home() {
  return (
    <div className={styles.page}>
<PageLogin />
    </div>
  );
}
