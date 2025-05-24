from passlib.hash import bcrypt

if __name__ == "__main__":
    plain = input("Enter password to hash: ")
    print(bcrypt.hash(plain))