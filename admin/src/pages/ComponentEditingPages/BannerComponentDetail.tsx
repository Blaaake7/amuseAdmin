import React, {useRef, useState} from "react";
import styles from '../../components/ComponentEditing/component.module.css'
import "./ComponentStyle/BannerComponentRegister.scss";
import {Editor} from "@toast-ui/react-editor";
import {useParams} from "react-router-dom";

import Swal from "sweetalert2";
import axios from "axios";

const BannerComponentDetail = () => {
	const {id} = useParams();
	const [title, setTitle] = useState<string>("")
	const [bannerTitle, setBannerTitle] = useState<string>("");
	
	/**
	 * Register API
	 
	const handleRegister = () => {
		// 등록할 데이터를 정리합니다.
	
		setItemCode(selected.map((select) => select.product_code));
		
		const postData = {
		  "title": title,
		  "type": "리스트",
		  "createdBy": "daw916@naver.com",
		  "itemCode": itemCode,
		};
	  
		// POST 요청을 보냅니다.
		axios
		  .post("https://ammuse.store/test/api/component/register/list", postData, {
			headers: {
			  Authorization: process.env.REACT_APP_COMPONENT_API_KEY,
			},
		  })
		  .then((response) => {
			Swal.fire({
				icon: "success",
				title: "리스트 컴포넌트 생성",
				confirmButtonText: "확인",
				confirmButtonColor: "#F184A1"
			});
			console.log(response)
		  })
		  .catch((error) => {
			Swal.fire({
				icon: "error",
				title: "리스트 컴포넌트 생성 오류",
				confirmButtonText: "확인",
				confirmButtonColor: "#F184A1"
			});
			console.log("등록 실패");
		  });
	  };

	  */
	
	///////
	const pcBannerRef = useRef<HTMLInputElement | null>(null);
	const [pcBannerUrl, setPcBannerUrl] = useState<string>("");
	const [pcBanner, setPcBanner] = useState("");
	const [pcBannerLink, setPcBannerLink] = useState("");
	const [pcBannerFileName, setPcBannerFileName] = useState("");
	
	const mobileBannerRef = useRef<HTMLInputElement | null>(null);
	const [mobileBannerUrl, setMobileBannerUrl] = useState<string>("");
	const [mobileBanner, setMobileBanner] = useState("");
	const [mobileBannerLink, setMobileBannerLink] = useState("");
	const [mobileBannerFileName, setMobileBannerFileName] = useState("");
	
	const [parsedHTML, setParsedHTML] = useState<string>("");
	const parsedHTMLRef = useRef<Editor>(null);
	
	const saveImgFile = (ref: any, setBannerFileName: any, setBanner: any,) => {
		try {
			if (ref != null) {
				// @ts-ignore
				setBannerFileName(ref.current.files[0].name);
				const file = ref.current.files[0];
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onloadend = () => {
					console.log(reader.result)
					setBanner(reader.result);
				}
			}
		} catch {
		
		}
	};
	
	//////////


	return (
		<div className="BannerComponentRegister">
			<div className={styles.body}>
				<div className="component-list-title">📍 배너 컴포넌트 수정</div>

				<div className="component-name">
					<p className={styles.p}>
						<div className={styles.pTitle}>컴포넌트 이름</div>
					</p>
					<input
						className="component-name-input"
						type="text"
						name="componentTitle"
						placeholder="컴포넌트 이름을 입력하세요"
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				
				<div className="banner-name">
					<p className={styles.p}>
						<div className={styles.pTitle}>배너 제목</div>
					</p>
					<input className="banner-name-input"
						type="text"
						name="adName"
						placeholder="배너의 제목을 입력하세요"
						onChange={(e) => setBannerTitle(e.target.value)}
					/>
				</div>
				
				<div className="banner-pc-image">
					<p className={styles.p}>
						<div className={styles.pTitle}>PC 배너</div>
					</p>

					<div className="banner-pc-input">
						<div className="banner-pc-image">
							<label className="banner-pc-image-label" htmlFor="pcBanner">사진 첨부</label>
							<input className="banner-pc-image-input"
								type="file"
								accept="image/*"
								id="pcBanner"
								onChange={() => saveImgFile(pcBannerRef, setPcBannerFileName, setPcBanner)}
								ref={pcBannerRef}
							/>

							<p className={styles.p}>
								{(pcBannerUrl) ? (<img src={pcBannerUrl} width={300} alt="pcBannerUrl" />) : (
									(pcBanner) ? (<img src={pcBanner} width={300} alt="pcBanner" />) : ("")
								)}
							</p>
						</div>
						
						<input className="banner-pc-link-input"
							type="text"
							name="pcBannerLink"
							placeholder="PC 배너의 링크를 입력하세요"
							onChange={e => setPcBannerLink(e.target.value)}
							value={pcBannerLink}
						/>
					</div>
				</div>
				
				<div className="banner-mobile-image">
					<p className={styles.p}>
						<div className={styles.pTitle}>모바일 배너</div>
					</p>

					<div className="banner-mobile-input">
						<div className="banner-mobile-image">
							<label className="banner-mobile-image-label" htmlFor="mobileBanner">사진 첨부</label>
							<input className="banner-mobile-image-input"
								type="file"
								accept="image/*"
								id="mobileBanner"
								onChange={() => saveImgFile(mobileBannerRef, setMobileBannerFileName, setMobileBanner)}
								ref={mobileBannerRef}
							/>

							<p className={styles.p}>
								{(mobileBannerUrl) ? (<img src={mobileBannerUrl} width={300} alt="mobileBannerUrl" />) : (
									(mobileBanner) ? (<img src={mobileBanner} width={300} alt="mobileBanner" />) : ("")
								)}
							</p>
						</div>

						<input className="banner-mobile-link-input"
							type="text"
							name="mobileBannerLink"
							placeholder="모바일 배너의 링크를 입력하세요"
							onChange={e => setMobileBannerLink(e.target.value)}
						   	value={mobileBannerLink}
						/>
					</div>
				</div>
				
				<div className="banner-content">
					<p className={styles.p}>
						<div className={styles.pTitle}>배너 내용</div>
					</p>
					<div style={{marginTop: 20}}>
						<Editor
							previewStyle="tab"
							initialEditType="markdown"
							hideModeSwitch={true}
							height="500px"
							toolbarItems={[
								// 툴바 옵션 설정
								['heading', 'bold', 'italic', 'strike'],
								['hr', 'quote'],
								['ul', 'ol', 'task', 'indent', 'outdent'],
								['table', 'image', 'link'],
								['code', 'codeblock']
							]}
							customHTMLRenderer={{
							// 구글 맵 삽입을 위한
							// iframe 태그 커스텀 코드
								htmlBlock: {
									iframe(node: any) {
										return [{
											type: 'openTag',
											tagName: 'iframe',
											outerNewLine: true,
											attributes: node.attrs
											},
											{type: 'html', content: node.childrenHTML},
											{type: 'closeTag', tagName: 'iframe', outerNewLine: true}];
									}
								}
							}}
							onChange={() => {
								try {
									// @ts-ignore
									setParsedHTML(parsedHTMLRef.current?.getInstance().getHTML());
								} catch (error) {
									console.log(error)
								}
							}}
							hooks={{
								addImageBlobHook: async (blob, callback) => {
									console.log(blob);
								}
							}}
						></Editor>
					</div>
				</div>
				
				<div className="component-make">
					<button className="component-button">수정하기</button>
				</div>
				{/*			
				<div className="component-make">
					<button className="component-button" onClick={handleRegister}>등록 하기</button>
				</div>
				*/}

			</div>
		</div>
	)
}

export default BannerComponentDetail;

