import React, { useEffect, useState } from "react";
import styles from "../../components/ComponentEditing/component.module.css";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import "./ComponentStyle/ListComponentRegister.scss";
import Swal from "sweetalert2";
import axios from "axios";

interface ItemData {
  item_db_id: number;
  product_code: string;
  startPrice: number;
  title: string;
}

interface ComponentData {
  id: number;
  title: string;
  type: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  productList: [];
}

const ListComponentDatail = () => {
  const { id } = useParams();
  const [title, setTitle] = useState<string>("");
  const [itemCode, setItemCode] = useState<string[]>([]);
  const [selected, setSelected] = useState<ItemData[]>([]);

  /**
   * Item API
   */
  const [itemData, setItemData] = useState<ItemData[]>([]);
  useEffect(() => {
    axios
      .get("http://ammuse.store/item/search?page=1")
      .then((response) => {
        const responseItem = response.data.data.items;
        setItemData(responseItem);
      })
      .catch((error) => {
        console.log("연결 실패");
      });
  }, [id]);

  /**
   * Component API
   */
  const [componentData, setComponentData] = useState<ComponentData | null>(null);
  useEffect(() => {
    axios
      .get(`http://ammuse.store/test/api/component/${id}`)
      .then((response) => {
        const responseComponent = response.data.data;
        setComponentData(responseComponent);
        setSelected(responseComponent?.productList || []);
        setTitle(responseComponent?.title || "");
      })
      .catch((error) => {
        console.log("연결 실패");
      });
  }, []);

  /**
   * Component Item Handler
   */

  const handleCheckboxChange = (itemComponent: ItemData, checked: boolean) => {
    if (checked) {
      setSelected((prevSelected) => [...prevSelected, itemComponent]);
    } else {
      setSelected((prevSelected) => prevSelected.filter((item) => item.item_db_id !== itemComponent.item_db_id));
    }
  };

  const handleItemReorder = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    const dragIndex = source.index;
    const hoverIndex = destination.index;

    const reorderedItems = [...selected];
    const draggedItem = reorderedItems[dragIndex];

    // 순서 변경
    reorderedItems.splice(dragIndex, 1);
    reorderedItems.splice(hoverIndex, 0, draggedItem);

    setSelected(reorderedItems);
  };

  /**
   * Register API
   */
  useEffect(() => {
    setItemCode(selected.map((select) => select.product_code));
  }, [selected]);

  const handleRegister = () => {
    // 변경할 데이터를 정리합니다.

    const postData = {
      id: id,
      title: title,
      type: "리스트",
      createdBy: "daw916@naver.com",
      updatedBy: "daw564@naver.com",
      itemCode: itemCode,
    };

    // POST 요청을 보냅니다.
    axios
      .post("http://vikrant.store/test/api/component/edit/list", postData, {
        headers: {
          Authorization: process.env.REACT_APP_COMPONENT_API_KEY,
        },
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "리스트 컴포넌트 수정",
          confirmButtonText: "확인",
          confirmButtonColor: "#F184A1",
        }).then(() => (window.location.href = "/componentV2"));
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "리스트 컴포넌트 수정 오류",
          confirmButtonText: "확인",
          confirmButtonColor: "#F184A1",
        });
      });
  };

  /**
   * Delete API
   */

  const handleDelete = () => {
    axios
      .get(`http://ammuse.store/test/api/component/delete/${id}`)
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "리스트 컴포넌트 삭제",
          confirmButtonText: "확인",
          confirmButtonColor: "#F184A1",
        }).then(() => (window.location.href = "/componentV2"));
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "리스트 컴포넌트 삭제 오류",
          confirmButtonText: "확인",
          confirmButtonColor: "#F184A1",
        });
      });
  };

  return (
    <div className="ListComponentRegister">
      <div className={styles.body}>
        <div className="component-list-title">📍 리스트 컴포넌트 수정</div>

        <div className="component-name">
          <p className={styles.p}>
            <div className={styles.pTitle}>컴포넌트 이름</div>
          </p>
          <input
            className="component-name-input"
            type="text"
            name="componentTitle"
            placeholder="컴포넌트 이름을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 순서 목록 */}
        <div className="component-order">
          <p className={styles.p}>
            <div className={styles.pTitle}>상품 순서</div>
          </p>

          <div className="component-check-list">
            <DragDropContext onDragEnd={handleItemReorder}>
              <Droppable droppableId="component-check">
                {(provided) => (
                  <div className="component-check" ref={provided.innerRef} {...provided.droppableProps}>
                    {selected.map((select, index) => (
                      <Draggable key={select.item_db_id} draggableId={`component-${select.item_db_id}`} index={index}>
                        {(provided) => (
                          <div
                            className="component-check"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {
                              <div className="component-check-item">
                                <div className="item">{select.item_db_id}</div>
                                <div className="item">{select.product_code}</div>
                                <div className="item">{select.title}</div>
                                <div className="item">{select.startPrice}원</div>
                              </div>
                            }
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>

        {/* 상품 목록 */}
        <div className="component-item-list">
          <p className={styles.p}>
            <div className={styles.pTitle}>상품 목록</div>
          </p>

          <div className="component-list">
            {itemData.map((item) => (
              <div className="component-item" key={item.item_db_id}>
                <input
                  className="component-check"
                  type="checkbox"
                  onChange={(e) => handleCheckboxChange(item, e.target.checked)}
                  checked={selected.some((selectedItem) => selectedItem.item_db_id === item.item_db_id)}
                />
                <div className="item">{item.item_db_id}</div>
                <div className="item">{item.product_code}</div>
                <div className="item">{item.title}</div>
                <div className="item">{item.startPrice}원</div>
              </div>
            ))}
          </div>
        </div>

        <div className="make-delete-button">
          <div className="component-make">
            <button className="component-button" onClick={handleRegister}>
              수정하기
            </button>
          </div>

          <div className="component-delete" onClick={handleDelete}>
            <button className="component-button">삭제하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListComponentDatail;
