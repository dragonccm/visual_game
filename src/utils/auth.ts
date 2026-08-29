const STORAGE_KEY_AUTH = 'history_game_admin_auth';
const STORAGE_KEY_CUSTOM_PASS = 'history_game_admin_custom_pass';

// Mặc định: Tài khoản: admin, Mật khẩu: admin123 (hoặc PIN: 938938)
const DEFAULT_ADMIN_USER = 'admin';
const DEFAULT_ADMIN_PASS = 'admin123';

class AuthService {
  public isAdminLoggedIn(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    } catch {
      return false;
    }
  }

  public login(username: string, pass: string): { success: boolean; message: string } {
    const trimmedUser = username.trim();
    const trimmedPass = pass.trim();

    const currentPass = localStorage.getItem(STORAGE_KEY_CUSTOM_PASS) || DEFAULT_ADMIN_PASS;

    if (
      (trimmedUser.toLowerCase() === DEFAULT_ADMIN_USER && trimmedPass === currentPass) ||
      trimmedPass === '938938' // Master PIN dự phòng
    ) {
      try {
        localStorage.setItem(STORAGE_KEY_AUTH, 'true');
      } catch {
        // Ignore
      }
      return { success: true, message: 'Đăng nhập Quản trị viên thành công!' };
    }

    return {
      success: false,
      message: 'Sai tên đăng nhập hoặc mật khẩu quản trị. Vui lòng thử lại!',
    };
  }

  public logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {
      // Ignore
    }
  }

  public changePassword(oldPass: string, newPass: string): { success: boolean; message: string } {
    const currentPass = localStorage.getItem(STORAGE_KEY_CUSTOM_PASS) || DEFAULT_ADMIN_PASS;
    if (oldPass !== currentPass && oldPass !== '938938') {
      return { success: false, message: 'Mật khẩu cũ không chính xác.' };
    }
    if (newPass.length < 4) {
      return { success: false, message: 'Mật khẩu mới phải có ít nhất 4 ký tự.' };
    }

    localStorage.setItem(STORAGE_KEY_CUSTOM_PASS, newPass);
    return { success: true, message: 'Đổi mật khẩu quản trị thành công!' };
  }
}

export const authService = new AuthService();
