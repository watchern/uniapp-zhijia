/**
 * nativeContact，通过Native.js调用原生API
 * 选择通讯录电话
 */
export const nativeContact = {
  /**
   * 通讯录模块
   */
  contacts: {
    getContact: (callBack) => {
      switch (plus.os.name) {
        case 'iOS':
          if (plus.device.model === 'iPhoneSimulator') {
            // 模拟器
            nativeContact.contacts.ios.visitContacts((name, phoneNumber) => {
              callBack(name, phoneNumber);
            });
          } else {
            // 真机
            nativeContact.contacts.ios.visitAddressBook((name, phoneNumber) => {
              callBack(name, phoneNumber);
            });
          }
          break;
        case 'Android':
          // Android通过plus.contacts.getAddressBook可弹出通讯录授权提示框
          // nativeContact.contacts.android.visitContacts(function(name, phoneNumber) {
          //     callBack(name, phoneNumber);
          // });
          plus.contacts.getAddressBook(
            plus.contacts.ADDRESSBOOK_PHONE,
            (addressbook) => {
              nativeContact.contacts.android.visitContacts(
                (name, phoneNumber) => {
                  callBack(name, phoneNumber);
                }
              );
            },
            (e) => {
              plus.nativeUI.alert(`Get address book failed: ${e.message}`);
            }
          );
          break;
        default:
          break;
      }
    },
    ios: {
      // 供iOS系统调用
      /**
       * 访问通讯录，将获取的联系人信息通过callBack返回
       * 仅限模拟器使用（Native.js 的bug）
       * @param {Object} callBack回调
       */
      visitContacts: (callBack) => {
        const contactPickerVC = plus.ios.newObject(
          'CNContactPickerViewController'
        );
        // 实现代理方法【- (void)contactPicker:(CNContactPickerViewController *)picker didSelectContact:(CNContact *)contact;】
        // 同时生成遵守CNContactPickerDelegate协议的代理对象delegate
        const delegate = plus.ios.implements('CNContactPickerDelegate', {
          'contactPicker:didSelectContact:': (picker, contact) => {
            // 姓名
            let name = '';
            // 姓氏
            const familyName = contact.plusGetAttribute('familyName');
            // 名字
            const givenName = contact.plusGetAttribute('givenName');
            name = familyName + givenName;
            // 电话号码
            let phoneNo = '';
            const phoneNumbers = contact.plusGetAttribute('phoneNumbers');
            if (phoneNumbers.plusGetAttribute('count') > 0) {
              const phone = phoneNumbers.plusGetAttribute('firstObject');
              const phoneNumber = phone.plusGetAttribute('value');
              phoneNo = phoneNumber.plusGetAttribute('stringValue');
            }
            if (callBack) {
              callBack(name, phoneNo);
            }
          },
          'contactPickerDidCancel:': () => {
            // 用户取消选择操作，处理错误逻辑
            if (callBack) {
              callBack('No contact selected', '');
            }
          }
        });
        // 给通讯录控制器contactPickerVC设置代理
        plus.ios.invoke(contactPickerVC, 'setDelegate:', delegate);
        // 获取当前UIWebView视图
        const currentWebview = plus.ios.currentWebview();
        // 根据当前UIWebView视图获取当前控制器
        const currentVC =
          nativeContact.contacts.ios.getViewControllerByView(currentWebview);
        // 由当前控制器present到通讯录控制器
        plus.ios.invoke(
          currentVC,
          'presentViewController:animated:completion:',
          contactPickerVC,
          true,
          null
        );
      },
      /**
       * 访问通讯录，将获取的联系人信息通过callBack返回
       * 仅限真机使用（Native.js 的bug）
       * @param {Object} callBack
       */
      visitAddressBook: (callBack) => {
        const peoplePickerNavController = plus.ios.newObject(
          'ABPeoplePickerNavigationController'
        );
        // 实现代理方法【- (void)peoplePickerNavigationController:(ABPeoplePickerNavigationController *)peoplePicker didSelectPerson:(ABRecordRef)person;】
        // 同时生成遵守ABPeoplePickerNavigationControllerDelegate协议的代理对象peoplePickerDelegate
        const peoplePickerDelegate = plus.ios.implements(
          'ABPeoplePickerNavigationControllerDelegate',
          {
            'peoplePickerNavigationController:didSelectPerson:': (
              peoplePicker,
              person
            ) => {
              // 这里的peoplePicker竟然是CNContact实例对象，person是undefined
              console.log(JSON.stringify(peoplePicker));
              console.log(JSON.stringify(person));
              console.log(typeof person);

              // 所以之前的代码不用改
              const contact = peoplePicker;
              // 姓名
              let name = '';
              // 姓氏
              const familyName = contact.plusGetAttribute('familyName');
              // 名字
              const givenName = contact.plusGetAttribute('givenName');
              name = familyName + givenName;
              // 电话号码
              let phoneNo = '';
              const phoneNumbers = contact.plusGetAttribute('phoneNumbers');
              if (phoneNumbers.plusGetAttribute('count') > 0) {
                const phone = phoneNumbers.plusGetAttribute('firstObject');
                const phoneNumber = phone.plusGetAttribute('value');
                phoneNo = phoneNumber.plusGetAttribute('stringValue');
              }
              if (callBack) {
                callBack(name, phoneNo);
              }
            },
            'peoplePickerNavigationControllerDidCancel:': () => {
              // 用户取消选择操作，处理错误逻辑
              if (callBack) {
                callBack('No contact selected', '');
              }
            }
          }
        );
        // 给通讯录控制器peoplePickerNavController设置代理
        plus.ios.invoke(
          peoplePickerNavController,
          'setPeoplePickerDelegate:',
          peoplePickerDelegate
        );
        // 获取当前UIWebView视图
        const UIApplicationClass = plus.ios.importClass('UIApplication');
        const UIAppObj = UIApplicationClass.sharedApplication();
        const del = plus.ios.invoke(UIAppObj, 'delegate');
        const appWindowObj = plus.ios.invoke(del, 'window');
        const appRootController = plus.ios.invoke(
          appWindowObj,
          'rootViewController'
        );
        // 由当前控制器present到通讯录控制器
        plus.ios.invoke(
          appRootController,
          'presentViewController:animated:completion:',
          peoplePickerNavController,
          true,
          null
        );
      }
    },
    android: {
      // 供android系统调用
      visitContacts: (callBack) => {
        plus.contacts.getAddressBook(
          plus.contacts.ADDRESSBOOK_PHONE,
          (book) => {
            const REQUESTCODE = 1000;
            const main = plus.android.runtimeMainActivity();
            const Intent = plus.android.importClass('android.content.Intent');
            const ContactsContract: any = plus.android.importClass(
              'android.provider.ContactsContract'
            );
            const intent = new Intent(
              Intent.ACTION_PICK,
              ContactsContract.Contacts.CONTENT_URI
            );
            main.onActivityResult = (requestCode, resultCode, data) => {
              console.log(`data`, JSON.stringify(data));
              console.log(`requestCode`, requestCode);
              console.log(`resultCode`, resultCode);
              console.log(
                `plus.android.importClass('android.app.Activity').RESULT_CANCELED`,
                plus.android.importClass('android.app.Activity').RESULT_CANCELED
              );
              if (REQUESTCODE === requestCode) {
                if (
                  resultCode ===
                  plus.android.importClass('android.app.Activity')
                    .RESULT_CANCELED
                ) {
                  // 用户取消选择操作，处理错误逻辑
                  if (callBack) {
                    callBack('No contact selected', '');
                  }
                } else {
                  let phoneNumber = '';
                  const resultString = '';
                  const context: any = main;
                  plus.android.importClass(data);
                  const contactData = data.getData();
                  const resolver = context.getContentResolver();
                  plus.android.importClass(resolver);
                  const cursor = resolver.query(
                    contactData,
                    null,
                    null,
                    null,
                    null
                  );
                  plus.android.importClass(cursor);
                  cursor.moveToFirst();
                  // 姓名
                  const givenName =
                    cursor.getString(
                      cursor.getColumnIndex(
                        ContactsContract.Contacts.DISPLAY_NAME
                      )
                    ) || '';
                  const contactId = cursor.getString(
                    cursor.getColumnIndex(ContactsContract.Contacts._ID)
                  );
                  const pCursor = resolver.query(
                    ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                    null,
                    `${ContactsContract.CommonDataKinds.Phone.CONTACT_ID} = ${contactId}`,
                    null,
                    null
                  );
                  if (pCursor.moveToNext()) {
                    phoneNumber = pCursor.getString(
                      pCursor.getColumnIndex(
                        ContactsContract.CommonDataKinds.Phone.NUMBER
                      )
                    );
                  }
                  if (callBack) {
                    callBack(givenName, phoneNumber);
                  }
                  cursor.close();
                  pCursor.close();
                }
              }
            };
            main.startActivityForResult(intent, REQUESTCODE);
          }
        );
      }
    }
  }
};
