import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../../services/axiosInstance";
import styles from "./ProductStatus.module.css";
import { useNavigate } from "react-router-dom";

interface Item {
  itemCode: string;
  title: string;
  imgUrl: string;
}

function ProductStatus() {
  const navigate = useNavigate();

  const [activeItemList, setActiveItemList] = useState<Item[]>([
    {
      itemCode: "",
      title: "",
      imgUrl: "",
    },
  ]);

  const [inActiveItemList, setInActiveItemList] = useState<Item[]>([
    {
      itemCode: "",
      title: "",
      imgUrl: "",
    },
  ]);

  const [activePageCount, setActivePageCount] = useState<number>(1);
  const [currentActivePage, setCurrentActivePage] = useState<number>(1);
  const [inActivePageCount, setInActivePageCount] = useState<number>(1);
  const [currentInActivePage, setCurrentInActivePage] = useState<number>(1);

  useEffect(() => {
    axios
      .get("https://devapi.wheelgo.net/test/api/product/getList/byDisplay", {
        params: {
          limit: 8,
          page: currentActivePage,
          displayStatus: "DISPLAY",
        },
      })
      .then((res) => {
        setActivePageCount(res.data.data.pageCount);
        const data = res.data.data.data;
        const processedData = data.map((item: any) => ({
          itemCode: item.itemCode,
          title: item.title,
          imgUrl: item.imgUrl,
        }));
        setActiveItemList(processedData);
      });
  }, [currentActivePage]);

  useEffect(() => {
    axios
      .get("https://devapi.wheelgo.net/test/api/product/getList/byDisplay", {
        params: {
          limit: 8,
          page: currentInActivePage,
          displayStatus: "HIDDEN",
        },
      })
      .then((res) => {
        setInActivePageCount(res.data.data.pageCount);
        const data = res.data.data.data;
        const processedData = data.map((item: any) => ({
          itemCode: item.itemCode,
          title: item.title,
          imgUrl: item.imgUrl,
        }));
        setInActiveItemList(processedData);
      });
  }, [currentInActivePage]);

  const handleDeleteProducts = (itemCode: string) => {
    const confirmDelete = window.confirm("삭제하시겠습니까?");
    if (confirmDelete) {
      setActiveItemList(
        activeItemList.filter((item) => {
          return item.itemCode !== itemCode;
        })
      );
      axios
        .get(`https://devapi.wheelgo.net/test/api/product/delete?itemCode=${itemCode}`, {
          params: {
            itemCode,
          },
        })
        .then((res) => console.log(res))
        .catch(console.error);
    }
  };

  const handleInActivateProduct = (item: Item) => {
    console.log(item);
    const confirmNone = window.confirm("상품을 비활성화 하시겠습니까?");
    if (confirmNone) {
      axios
        .post(`https://devapi.wheelgo.net/test/api/change/item/${item.itemCode}/displayStatus`, {
          display_true: false,
        })
        .then((res) => {
          console.log(res);
          setActiveItemList(
            activeItemList.filter((activeItem) => {
              return activeItem.itemCode !== item.itemCode;
            })
          );
          setInActiveItemList((prev) => [...prev, item]);
        })
        .catch(console.error);
    }
  };

  const handleActivateProduct = (item: Item) => {
    console.log(item);
    const confirmActive = window.confirm("상품을 활성화 하시겠습니까?");
    if (confirmActive) {
      axios
        .post(`https://devapi.wheelgo.net/test/api/change/item/${item.itemCode}/displayStatus`, {
          display_true: true,
        })
        .then((res) => {
          console.log(res);
          setInActiveItemList(
            inActiveItemList.filter((inActiveItem) => {
              return inActiveItem.itemCode !== item.itemCode;
            })
          );
          setActiveItemList((prev) => [...prev, item]);
        })
        .catch(console.error);
    }
  };

  return (
    <div>
      <div className={styles.activeItemContainer}>
        <div className={styles.title}>활성화 상품</div>
        <div className={styles.divider}></div>
        <ul className={styles.activeItemList}>
          {activeItemList.map((item: any) => (
            <li className={styles.activeItem} key={item.itemCode}>
              <img className={styles.activeImg} src={item.imgUrl} alt="" />
              <div className={styles.btnContainer}>
                <button onClick={() => navigate(`/edit/${item.itemCode}`)}>수정</button>
                <button onClick={() => handleDeleteProducts(item.itemCode)}>삭제</button>
                <button onClick={() => handleInActivateProduct(item)}>비활성화</button>
                <button onClick={() => navigate(`/copy/${item.itemCode}`)}>복사</button>
              </div>
              <div className={styles.productCodeContainer}>
                <p className={styles.label}>상품 코드</p>
                <p>{item.itemCode}</p>
              </div>
              <div className={styles.productTitleContainer}>
                <p className={styles.label}>제목</p>
                <p>{item.title}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.pageBtnContainer}>
          {[...Array(activePageCount)].map((e, idx) => (
            <button className={styles.pageBtn} key={idx} onClick={() => setCurrentActivePage(idx + 1)}>
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.inActiveItemContainer}>
        <div className={styles.title}>비활성화 상품</div>
        <div className={styles.divider}></div>
        <ul className={styles.inActiveItemList}>
          {inActiveItemList.map((item: any) => (
            <li className={styles.inActiveItem} key={item.itemCode}>
              <img className={styles.inActiveImg} src={item.imgUrl} alt="" />
              <div className={styles.btnContainer}>
                <button onClick={() => navigate(`/edit/${item.itemCode}`)}>수정</button>
                <button onClick={() => handleDeleteProducts(item.itemCode)}>삭제</button>
                <button onClick={() => handleActivateProduct(item)}>활성화</button>
                <button onClick={() => navigate(`/copy/${item.itemCode}`)}>복사</button>
              </div>
              <div className={styles.productCodeContainer}>
                <p className={styles.label}>상품 코드</p>
                <p>{item.itemCode}</p>
              </div>
              <div className={styles.productTitleContainer}>
                <p className={styles.label}>제목</p>
                <p>{item.title}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.pageBtnContainer}>
          {[...Array(inActivePageCount)].map((e, idx) => (
            <button className={styles.pageBtn} key={idx} onClick={() => setCurrentInActivePage(idx + 1)}>
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductStatus;
