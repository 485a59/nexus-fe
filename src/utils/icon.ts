import { Icon } from "@iconify/vue";
import { h } from "vue";

export const fileImgMap = new Map([
	['avi', '@/assets/file/file_avi.png'],
	['bat', '@/assets/file/file_powershell.png'],
	['c', '@/assets/file/file_c.png'],
	['c++', '@/assets/file/file_c++.png'],
	// ['c#', require('@/assets/file/file_c#.png')],
	['css', '@/assets/file/file_css.png'],
	['go', '@/assets/file/file_go.png'],
	['py', '@/assets/file/file_python.png'],
	['styl', '@/assets/file/file_stylus.png'],
	['less', '@/assets/file/file_less.png'],
	['conf', '@/assets/file/file_nginx.png'],
	['m', '@/assets/file/file_objective_c.png'],
	['scss', '@/assets/file/file_scss.png'],
	['sass', '@/assets/file/file_sass.png'],
	['csv', '@/assets/file/file_csv.png'],
	['dmg', '@/assets/file/file_dmg.png'],
	['dir', 'src/assets/file/dir.svg'],
	['doc', '@/assets/file/file_word.svg'],
	['docx', '@/assets/file/file_word.svg'],
	['exe', '@/assets/file/file_exe.png'],
	['html', '@/assets/file/file_html.png'],
	['jar', '@/assets/file/file_jar.png'],
	['java', '@/assets/file/file_java.png'],
	['js', '@/assets/file/file_js.png'],
	['json', '@/assets/file/file_json.png'],
	['jsp', '@/assets/file/file_jsp.png'],
	['kt', '@/assets/file/file_kotlin.png'],
	['mp3', '@/assets/file/file_music.png'],
	['mp4', '@/assets/file/file_video.svg'],
	['flac', '@/assets/file/file_flac.svg'],
	['oa', '@/assets/file/file_oa.png'],
	['open', '@/assets/file/file_open.png'],
	['pdf', '@/assets/file/file_pdf.png'],
	['php', '@/assets/file/file_php.png'],
	['ppt', '@/assets/file/file_ppt.svg'],
	['pptx', '@/assets/file/file_ppt.svg'],
	['properties', '@/assets/file/file_properties.png'],
	['r', '@/assets/file/file_r.png'],
	['rar', '@/assets/file/file_rar.png'],
	['rs', '@/assets/file/file_rust.png'],
	['rtf', '@/assets/file/file_rtf.png'],
	['sh', '@/assets/file/file_shell.png'],
	['sql', '@/assets/file/file_sql.png'],
	['svg', '@/assets/file/file_svg.png'],
	['swift', '@/assets/file/file_swift.png'],
	['ts', '@/assets/file/file_typescript.png'],
	['txt', '@/assets/file/file_txt.png'],
	['vue', '@/assets/file/file_vue.png'],
	['xls', '@/assets/file/file_excel.svg'],
	['xlsx', '@/assets/file/file_excel.svg'],
	['xml', '@/assets/file/file_xml.png'],
	['zip', '@/assets/file/file_zip.png'],
	['7z', '@/assets/file/file_7z.svg'],
	['tar', '@/assets/file/file_tar.svg'],
	['md', '@/assets/file/file_markdown.png'],
	['markdown', '@/assets/file/file_markdown.png'],
	['yaml', '@/assets/file/file_yaml.png'],
	['yml', '@/assets/file/file_yaml.png'],
	['txt', '@/assets/file/file_txt.png'],
	['png', '@/assets/file/file_png.svg'],
	['jpg', '@/assets/file/file_jpg.svg'],
	['jpeg', '@/assets/file/file_jpeg.svg'],
])


/**
 * 根据文件类型和名称获取对应的图标
 * @param type 文件类型（file 或 folder）
 * @param name 文件名称（用于匹配文件扩展名）
 * @returns 对应的图标路径或组件
 */
export function getIcon(type: string, name: string): string {
  if (type === "文件夹") {
    return fileImgMap.get('dir');
  }

  // 获取文件扩展名
  const extension = name.split(".").pop()?.toLowerCase();
  if (extension && fileImgMap.has(extension)) {
    return fileImgMap.get(extension).replace("@/", "src/");
  }
}
